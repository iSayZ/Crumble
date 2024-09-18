const AbstractRepository = require("./AbstractRepository");

const { activeUsers } = require("../../app/socket");

class CommentRepository extends AbstractRepository {
  constructor() {
    // Call the constructor of the parent class (AbstractRepository)
    // and pass the table name "comment" as configuration
    super({ table: "comment" });
  }

  // The C of CRUD - Create operation
  async create(comment) {
    const connection = await this.database.getConnection();
    try {
      await connection.beginTransaction();

      // Execute the SQL INSERT query to add a new comment
      const [result] = await this.database.query(
        `insert into ${this.table} (id_publication_fk, id_account_fk, content, date_comment) values (?, ?, ?, NOW())`,
        [comment.id_publication, comment.id_account, comment.content]
      );

      // Execute the SQL INSERT query to add a new notification at the author publication
      await this.database.query(
        `insert into notification (id_publication_fk, id_sender, source, content, date_notification) values (?, ?, ?, ?, NOW())`,
        [
          comment.id_publication,
          comment.id_account,
          "comment",
          "a ajouté un commentaire à votre",
        ]
      );

      const [idAuthor] = await this.database.query(
        `SELECT id_account_fk FROM publication WHERE id_publication = ?;`,
        [comment.id_publication]
      );

      await connection.commit();

      // For send a notification with socket at the author
      // eslint-disable-next-line global-require
      const { io } = require("../../index");

      // Vérifier si le destinataire est en ligne
      const recipientSocketId = activeUsers.get(idAuthor[0].id_account_fk);
      const senderSocketId = comment.id_account;
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("general_notification", {
          senderSocketId,
        });
      }

      // Return the ID of the newly inserted comment
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error; // Throw error to handle it outside
    } finally {
      connection.release();
    }
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing comment
  async update(comment) {
    // Execute the SQL UPDATE query to update a specific comment
    const [result] = await this.database.query(
      `update ${this.table} set content = ? where id_comment = ?`,
      [comment.content, comment.id_comment]
    );

    // Return how many rows were affected
    return result.affectedRows;
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an friendRequest by its ID
  async delete(id) {
    const connection = await this.database.getConnection();
    try {
      await connection.beginTransaction();

      // Execute the SQL INSERT query to delete the notification at the author publication
      await this.database.query(
        `DELETE FROM notification
WHERE id_publication_fk = (
    SELECT id_publication_fk
    FROM comment
    WHERE id_comment = ?
);
`,
        [id]
      );

      // Execute the SQL DELETE query to delete a specific comment
      const [result] = await this.database.query(
        `delete from ${this.table} where id_comment = ?`,
        [id]
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

module.exports = CommentRepository;
