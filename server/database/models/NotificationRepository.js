const AbstractRepository = require("./AbstractRepository");

const { activeUsers } = require("../../app/socket");

class NotificationRepository extends AbstractRepository {
  constructor() {
    // Call the constructor of the parent class (AbstractRepository)
    // and pass the table name "notifications" as configuration
    super({ table: "notification" });
  }

  // The C of CRUD - Create operation
  async create(notification) {
    // Execute the SQL INSERT query to add a new notification to the "notifications" table
    const [result] = await this.database.query(
      `insert into ${this.table} (id_publication_fk, id_account_fk, date_notification) values (?, ?, NOW())`,
      [notification.id_publication, notification.id_account]
    );

    // Return the ID of the newly inserted notification
    return result.insertId;
  }

  // The Rs of CRUD - Read operations
  async readAllByAccountId(id) {
    const connection = await this.database.getConnection();
    try {
      await connection.beginTransaction();

      // Execute the SQL SELECT query to retrieve a specific notification by its ID
      const [rows] = await connection.query(
        `SELECT 
    n.*,
    u.firstname,
    u.lastname,
    u.avatar
FROM 
    notification AS n
JOIN 
    publication AS p ON n.id_publication_fk = p.id_publication
JOIN 
    account AS a ON n.id_sender = a.id_account
JOIN 
    user AS u ON a.id_user_fk = u.id_user
WHERE 
    p.id_account_fk = ?
ORDER BY 
    n.date_notification DESC;
              `,
        [id]
      );

      // For update is_read at true
      await connection.query(
        `
              UPDATE notification AS n
              JOIN publication AS p ON n.id_publication_fk = p.id_publication
              SET n.is_read = 1
              WHERE p.id_account_fk = ?;
            `,
        [id]
      );

      await connection.commit();

      // eslint-disable-next-line global-require
      const { io } = require("../../index");

      const connectedSocketId = activeUsers.get(+id);
      if (connectedSocketId) {
        io.to(connectedSocketId).emit("reset_notifications");
      }

      // Return the first row of the result, which represents the notification
      return rows;
    } catch (error) {
      await connection.rollback();
      throw error; // Throw error to handle it outside
    } finally {
      connection.release();
    }
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an notification by id of publication and account
  async delete(id) {
    // Execute the SQL DELETE query to delete a specific category
    const [result] = await this.database.query(
      `delete from ${this.table} where id_notification = ?;`,
      [id]
    );
    // Return how many rows were affected
    return result.affectedRows;
  }
}

module.exports = NotificationRepository;
