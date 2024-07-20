const AbstractRepository = require("./AbstractRepository");

class LikeRepository extends AbstractRepository {
  constructor() {
    // Call the constructor of the parent class (AbstractRepository)
    // and pass the table name "friend_request" as configuration
    super({ table: "likes" });
  }

  // The C of CRUD - Create operation

  async create(like) {
    // Execute the SQL INSERT query to add a new like to the "friend_request" table
    const [result] = await this.database.query(
      `insert into ${this.table} (id_publication_fk, id_account_fk, date_like) values (?, ?, NOW())`,
      [like.id_publication, like.id_account]
    );

    // Return the ID of the newly inserted friendRequest
    return result.insertId;
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an friendRequest by its ID
  async delete(params) {
    // Execute the SQL DELETE query to delete a specific category
    const [result] = await this.database.query(
      `delete from ${this.table} where id_publication_fk = ? AND id_account_fk = ?`,
      [params.id_publication, params.id_account]
    );
    // Return how many rows were affected
    return result.affectedRows;
  }
}

module.exports = LikeRepository;
