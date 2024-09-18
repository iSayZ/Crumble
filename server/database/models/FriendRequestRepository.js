const AbstractRepository = require("./AbstractRepository");

const { activeUsers } = require("../../app/socket");

class FriendRequestRepository extends AbstractRepository {
  constructor() {
    // Call the constructor of the parent class (AbstractRepository)
    // and pass the table name "friend_request" as configuration
    super({ table: "friend_request" });
  }

  // The C of CRUD - Create operation

  async create(friendRequest) {
    // Execute the SQL INSERT query to add a new friendRequest to the "friend_request" table
    const [result] = await this.database.query(
      `insert into ${this.table} (id_sender, id_recipient, date_friend_request) values (?, ?, NOW())`,
      [friendRequest.id_account, friendRequest.id_recipient]
    );

    // eslint-disable-next-line global-require
    const { io } = require("../../index");

    // Check if the recipient is online
    const recipientSocketId = activeUsers.get(friendRequest.id_recipient);
    const senderSocketId = friendRequest.id_account;
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("friend_request_notification", {
        senderSocketId,
      });
    }

    // Return the ID of the newly inserted friendRequest
    return result.insertId;
  }

  async countFriendRequestAndMsg(id) {
    // Connection at the database for transaction
    const connection = await this.database.getConnection();

    try {
      // Start a transaction
      await connection.beginTransaction();

      // Retrieve the count of friend requests
      const [rowsFriend] = await connection.execute(
        `
            SELECT COUNT(*) AS friend_requests_count
            FROM friend_request
            WHERE id_recipient = ?;
        `,
        [id]
      );

      // Retrieve the count of messages
      const [rowsMessage] = await connection.execute(
        `
  SELECT COUNT(*) AS messages_count
  FROM message AS m
  JOIN conversation AS c 
  ON m.id_conversation = c.id_conversation
  WHERE 
      ((c.id_account_1 = ? AND c.id_account_2 != ?)
      OR 
      (c.id_account_1 != ? AND c.id_account_2 = ?))
      AND m.is_read = 0
      AND m.id_sender != ?;;
        `,
        [id, id, id, id, id]
      );

      // Retrieve the count of notifications
      const [rowsNotification] = await connection.execute(
        `
          SELECT 
      COUNT(*) AS notifications_count
  FROM 
      notification AS n
  JOIN 
      publication AS p ON n.id_publication_fk = p.id_publication
  WHERE 
      p.id_account_fk = ?
      AND n.is_read = 0;
      `,
        [id]
      );

      await connection.commit();

      return {
        friend_requests_count: rowsFriend[0].friend_requests_count,
        messages_count: rowsMessage[0].messages_count,
        notifications_count: rowsNotification[0].notifications_count,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an friendRequest by its ID
  async delete(id) {
    // Execute the SQL DELETE query to delete a specific category
    const [result] = await this.database.query(
      `delete from ${this.table} where id_friend_request = ?`,
      [id]
    );

    // Return how many rows were affected
    return result.affectedRows;
  }
}

module.exports = FriendRequestRepository;
