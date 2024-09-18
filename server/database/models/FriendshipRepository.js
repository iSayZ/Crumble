const AbstractRepository = require("./AbstractRepository");

class FriendshipRepository extends AbstractRepository {
  constructor() {
    // Call the constructor of the parent class (AbstractRepository)
    // and pass the table name "friendship" as configuration
    super({ table: "friendship" });
  }

  // The C of CRUD - Create operation
  async create(friendship) {
    // Execute the SQL INSERT query to add a new friendship to the "friendship" table
    const [result] = await this.database.query(
      `insert into ${this.table} (id_account_1, id_account_2, date_friendship) values (?, ?, NOW())`,
      [friendship.id_account_1, friendship.id_account_2]
    );

    // Return the ID of the newly inserted friendship
    return result.insertId;
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an friendship by its ID
  async delete(id) {
    // Execute the SQL DELETE query to delete a specific friendship
    const [result] = await this.database.query(
      `delete from ${this.table} where id_friendship = ?`,
      [id]
    );
    // Return how many rows were affected
    return result.affectedRows;
  }
}

module.exports = FriendshipRepository;
