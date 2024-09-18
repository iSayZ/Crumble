const AbstractRepository = require("./AbstractRepository");

const { activeUsers } = require("../../app/socket");

class ConversationRepository extends AbstractRepository {
  constructor() {
    // Call the constructor of the parent class (AbstractRepository)
    // and pass the table name "conversation" as configuration
    super({ table: "conversation" });
  }

  async getOrCreateConversation(idUserConnected, idUserSelected) {
    const connection = await this.database.getConnection();
    try {
      await connection.beginTransaction();

      // Check if a conversation already exists
      const [rows] = await connection.execute(
        `
            SELECT id_conversation 
            FROM conversation 
            WHERE (id_account_1 = ? AND id_account_2 = ?)
               OR (id_account_1 = ? AND id_account_2 = ?)
        `,
        [idUserConnected, idUserSelected, idUserSelected, idUserConnected]
      );

      let conversationId;

      if (rows.length === 0) {
        // Create a new conversation
        const [result] = await connection.execute(
          `
                INSERT INTO conversation (id_account_1, id_account_2) 
                VALUES (?, ?)
            `,
          [idUserConnected, idUserSelected]
        );
        conversationId = result.insertId;
      } else {
        conversationId = rows[0].id_conversation;
      }

      // Retrieve messages associated with the conversation, with pagination if necessary
      const [messages] = await connection.execute(
        `
            SELECT 
                m.id_message,
                m.date_message,
                m.content,
                m.id_sender
            FROM 
                message m
            WHERE 
                m.id_conversation = ?
            ORDER BY 
                m.date_message ASC
        `,
        [conversationId]
      );

      // Retrieve the information of the selected user
      const [userSelected] = await connection.execute(
        `
            SELECT 
                u.*
            FROM 
                user AS u
            INNER JOIN account AS a ON id_account = ?
            WHERE 
                u.id_user = a.id_user_fk
        `,
        [idUserSelected]
      );

      const friend = userSelected[0];

      // Mark the messages as read
      const isRead = await connection.execute(
        `
            UPDATE message
            SET is_read = 1
            WHERE id_conversation = ? AND id_sender = ?;
        `,
        [conversationId, idUserSelected]
      );
      await connection.commit();

      // eslint-disable-next-line global-require
      const { io } = require("../../index");

      // Remove message notifications
      const connectedSocketId = activeUsers.get(+idUserConnected);
      if (connectedSocketId) {
        io.to(connectedSocketId).emit("reset_message_read", {
          countMessageRead: isRead[0].changedRows,
        });
      }

      return {
        conversationId,
        messages,
        friend,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = ConversationRepository;
