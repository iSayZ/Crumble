const argon2 = require("argon2");
const AbstractRepository = require("./AbstractRepository");

class AccountRepository extends AbstractRepository {
  constructor() {
    // Call the constructor of the parent class (AbstractRepository)
    // and pass the table name "publication" as configuration
    super({ table: "account" });
  }

  async readByEmail(email) {
    // Execute the SQL SELECT query to retrieve a specific user by its email
    const [rows] = await this.database.query(
      `SELECT *
        FROM ${this.table}
        WHERE email=(?);`,
      [email]
    );

    // Return the first row of the result, which represents the user
    return rows[0];
  }

  async readAccountWithUser(id) {
    // Execute the SQL SELECT query to retrieve a specific user by its account ID
    const [rows] = await this.database.query(
      `SELECT id_account, email, date_creation, u.*
        FROM ${this.table}
        INNER JOIN user AS u ON id_user = id_user_fk
        WHERE id_account=(?);`,
      [id]
    );

    // Return the first row of the result, which represents the user
    return rows[0];
  }

  async readProfile(id) {
    // Execute the SQL SELECT query to retrieve a specific user by its accountID
    const [rows] = await this.database.query(
      `SELECT 
    a.id_account, 
    a.date_creation, 
    u.*,
    (
        SELECT id_friendship
FROM friendship
WHERE (id_account_1 = ? AND id_account_2 = ?)
   OR (id_account_1 = ? AND id_account_2 = ?)
    ) AS friendship_exists,
     (
        SELECT COUNT(*)
FROM friend_request
WHERE (id_sender = ? AND id_recipient = ?)
   OR (id_sender = ? AND id_recipient = ?)
    ) AS friend_request_exists
FROM 
    ${this.table} AS a
INNER JOIN 
    user AS u ON u.id_user = a.id_user_fk
WHERE 
    a.id_account = ?;

`,
      [
        id.profile_connected,
        id.profile_consulted,
        id.profile_consulted,
        id.profile_connected,
        id.profile_connected,
        id.profile_consulted,
        id.profile_consulted,
        id.profile_connected,
        id.profile_consulted,
      ]
    );

    // Return the first row of the result, which represents the user
    return rows[0];
  }

  async updateAccount(accountDetails) {
    const connection = await this.database.getConnection();
    try {
      // Begin many operations in SQL to be executed at once or all rollback
      await connection.beginTransaction();

      if (accountDetails.email) {
        await connection.query(
          `UPDATE ${this.table} SET email = ? WHERE id_account = ?`,
          [accountDetails.email, accountDetails.id]
        );
      }

      if (accountDetails.password) {
        const [oldPassword] = await connection.query(
          `SELECT password FROM ${this.table} WHERE id_account = ?`,
          [accountDetails.id]
        );

        const isMatch = await argon2.verify(
          oldPassword[0].password,
          accountDetails.oldPassword
        );

        if (isMatch) {
          await connection.query(
            `UPDATE ${this.table} SET password = ?  WHERE id_account = ?`,
            [accountDetails.password, accountDetails.id]
          );
        } else {
          throw new Error("Wrong old password !");
        }
      }

      // CONNECTION => COMMIT, ROLLBACK, RELEASE
      await connection.commit();
      return accountDetails; // Return member on success
    } catch (error) {
      console.error(error);
      await connection.rollback();
      throw error; // Throw error to handle it outside
    } finally {
      connection.release();
    }
  }
}

module.exports = AccountRepository;
