const AbstractRepository = require("./AbstractRepository");

const { activeUsers, socketConversations } = require("../../app/socket");

class MessageRepository extends AbstractRepository {
  constructor() {
    // Call the constructor of the parent class (AbstractRepository)
    // and pass the table name "messages" as configuration
    super({ table: "message" });
  }

  // The C of CRUD - Create operation

  async create(message) {
    // eslint-disable-next-line global-require
    const { io } = require("../../index");

    const [idRecipient] = await this.database.query(
      `SELECT 
    CASE 
        WHEN id_account_1 = ? THEN id_account_2
        ELSE id_account_1
    END AS id_account
FROM 
    conversation
WHERE 
    id_conversation = ?
    AND (id_account_1 = ? OR id_account_2 = ?);
`,
      [
        message.id_account,
        message.conversationId,
        message.id_account,
        message.id_account,
      ]
    );

    const recipientSocketId = activeUsers.get(idRecipient[0].id_account);

    const recipientConversations =
      socketConversations.get(recipientSocketId) || new Set();

    const recipientIsOnConversation = recipientConversations.has(
      message.conversationId
    );

    // Execute the SQL INSERT query to add a new message to the "messages" table
    const [result] = await this.database.query(
      `insert into ${this.table} (id_sender, id_conversation, content, date_message, is_read) values (?, ?, ?, NOW(), ?)`,
      [
        message.id_account,
        message.conversationId,
        message.content,
        recipientIsOnConversation ? 1 : 0,
      ]
    );

    if (recipientSocketId) {
      if (!recipientIsOnConversation) {
        io.to(recipientSocketId).emit("new_message_notification", {
          senderSocketId: idRecipient[0].id_account,
        });
      }
    }

    // Return the ID of the newly inserted message
    return result.insertId;
  }
}

module.exports = MessageRepository;
