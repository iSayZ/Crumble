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

}

module.exports = AccountRepository;
