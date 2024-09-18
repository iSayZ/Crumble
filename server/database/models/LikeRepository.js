const AbstractRepository = require("./AbstractRepository");

const { activeUsers } = require("../../app/socket");

class LikeRepository extends AbstractRepository {
  constructor() {
    // Call the constructor of the parent class (AbstractRepository)
    // and pass the table name "likes" as configuration
    super({ table: "likes" });
  }

  // The C of CRUD - Create operation

  async create(like) {
    const connection = await this.database.getConnection();
    try {
      await connection.beginTransaction();

      // Execute the SQL INSERT query to add a new like to the "likes" table
      const [result] = await this.database.query(
        `insert into ${this.table} (id_publication_fk, id_account_fk, date_like) values (?, ?, NOW())`,
        [like.id_publication, like.id_account]
      );

      // Execute the SQL INSERT query to add a new notification at the author publication
      await this.database.query(
        `insert into notification (id_publication_fk, id_sender, source, content, date_notification) values (?, ?, ?, ?, NOW())`,
        [like.id_publication, like.id_account, "like", "aime votre"]
      );

      const [idAuthor] = await this.database.query(
        `SELECT id_account_fk FROM publication WHERE id_publication = ?;`,
        [like.id_publication]
      );

      await connection.commit();

      // For send a notification with socket at the author
      // eslint-disable-next-line global-require
      const { io } = require("../../index");

      // Check if the recipient is online
      const recipientSocketId = activeUsers.get(idAuthor[0].id_account_fk);
      const senderSocketId = like.id_account;
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("general_notification", {
          senderSocketId,
        });
      }

      // Return the ID of the newly inserted like
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error; // Throw error to handle it outside
    } finally {
      connection.release();
    }
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an like by id of publication and account
  async delete(params) {
    const connection = await this.database.getConnection();
    try {
      await connection.beginTransaction();

      // Execute the SQL DELETE query to delete a specific category
      const [result] = await this.database.query(
        `delete from ${this.table} where id_publication_fk = ? AND id_account_fk = ?`,
        [params.id_publication, params.id]
      );

      // Execute the SQL INSERT query to delete the notification of like at the author publication
      await this.database.query(
        `delete from notification where id_publication_fk = ? AND id_sender = ?`,
        [params.id_publication, params.id]
      );

      await connection.commit();

      // Return how many rows were affected
      return result.affectedRows;
    } catch (error) {
      await connection.rollback();
      throw error; // Throw error to handle it outside
    } finally {
      connection.release();
    }
  }
}

module.exports = LikeRepository;
