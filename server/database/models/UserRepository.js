const AbstractRepository = require("./AbstractRepository");

class UserRepository extends AbstractRepository {
  constructor() {
    // Call the constructor of the parent class (AbstractRepository)
    // and pass the table name "publication" as configuration
    super({ table: "user" });
  }

  // The C of CRUD - Create operation

  async create(user) {

    // Connection at the database for transaction
    const connection = await this.database.getConnection();

    try {
      // Begin the transaction
      await connection.beginTransaction();
    
      // Execute the first request user
      const [result1] = await connection.execute('INSERT INTO user (lastname, firstname, sex, birthdate, country) VALUES (?, ?, ?, ?, ?)',
      [user.lastname, user.firstname, user.sex, user.birthdate, user.country]);

      // Execute the second request account
      const [result2] = await connection.execute('INSERT INTO account (date_creation, email, password, id_user_fk) VALUES (NOW(), ?, ?, ?)',
      [user.email, user.password, result1.insertId]);
    
      // Commit the transaction if all queries succeed
      await connection.commit();

      // Return the ID of the newly inserted user
      console.info("User created successfully")
      return result2.insertId;

    } catch (error) {
      // Rollback the transaction in case of an error
      await connection.rollback();

      // Return number error
      console.error("Error on user creation =>", error)
      throw error.errno;
    } finally {
      // Close the connection
      await connection.release();
    }
  }

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific user by its ID
    const [rows] = await this.database.query(
      `select * from ${this.table} where id_user = ?`,
      [id]
    );

    // Return the first row of the result, which represents the user
    return rows[0];
  }

  async readAllForSuggestion(id) {
    // Execute the SQL SELECT query to retrieve all users from the "user" table
    const [rows] = await this.database.query(
      `SELECT 
    u.*,
    a.id_account,
    (
        SELECT COUNT(DISTINCT f1.friend_id)
        FROM (
            SELECT id_account_2 AS friend_id FROM friendship WHERE id_account_1 = ?
            UNION
            SELECT id_account_1 AS friend_id FROM friendship WHERE id_account_2 = ?
        ) f1
        JOIN (
            SELECT id_account_2 AS friend_id FROM friendship WHERE id_account_1 = a.id_account
            UNION
            SELECT id_account_1 AS friend_id FROM friendship WHERE id_account_2 = a.id_account
        ) f2 ON f1.friend_id = f2.friend_id
    ) AS friendship_common
FROM 
    ${this.table} u
JOIN 
    account a ON u.id_user = a.id_user_fk
WHERE 
    a.id_account != ?
    AND NOT EXISTS (
        SELECT 1
        FROM friendship f
        WHERE (f.id_account_1 = ? AND f.id_account_2 = a.id_account)
           OR (f.id_account_2 = ? AND f.id_account_1 = a.id_account)
    )
    AND NOT EXISTS (
        SELECT 1
        FROM friend_request fr
        WHERE (fr.id_sender = ? AND fr.id_recipient = a.id_account)
           OR (fr.id_recipient = ? AND fr.id_sender = a.id_account)
    );`,
      [id, id, id, id, id, id, id]
    );

    // Return the array of users
    return rows;
  }

  async readFriendRequestById(id) {
    // Execute the SQL SELECT query to retrieve a specific user by its ID
    const [rows] = await this.database.query(
      `SELECT 
    fr.*, 
    u.*, 
    a.id_account,
    (
        SELECT COUNT(DISTINCT f1.friend_id)
        FROM (
            SELECT id_account_2 AS friend_id FROM friendship WHERE id_account_1 = ?
            UNION
            SELECT id_account_1 AS friend_id FROM friendship WHERE id_account_2 = ?
        ) f1
        JOIN (
            SELECT id_account_2 AS friend_id FROM friendship WHERE id_account_1 = a.id_account
            UNION
            SELECT id_account_1 AS friend_id FROM friendship WHERE id_account_2 = a.id_account
        ) f2 ON f1.friend_id = f2.friend_id
    ) AS friendship_common
FROM 
    ${this.table} u
INNER JOIN 
    account a ON a.id_user_fk = u.id_user
INNER JOIN 
    friend_request fr ON fr.id_sender = a.id_account
WHERE 
    fr.id_recipient = ?;
`,
      [id, id, id]
    );

    // Return the first row of the result, which represents the user
    return rows;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing user

  // async update(user) {
  //   ...
  // }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an user by its ID

  // async delete(id) {
  //   ...
  // }
}

module.exports = UserRepository;
