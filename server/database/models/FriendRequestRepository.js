const AbstractRepository = require("./AbstractRepository");

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
      [friendRequest.id_sender, friendRequest.id_recipient]
    );

    // Return the ID of the newly inserted friendRequest
    return result.insertId;
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
