const AbstractRepository = require("./AbstractRepository");

class PublicationRepository extends AbstractRepository {
  constructor() {
    // Call the constructor of the parent class (AbstractRepository)
    // and pass the table name "publication" as configuration
    super({ table: "publication" });
  }

  // The C of CRUD - Create operation

  async create(publication) {
    // Execute the SQL INSERT query to add a new publication to the "publication" table
    const [result] = await this.database.query(
      `insert into ${this.table} (id_account_fk, content, picture, date_publication) values (?, ?, ?, NOW())`,
      [publication.id_account, publication.content, publication.picture || null]
    );

    // Return the ID of the newly inserted publication
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific publication by its ID
    const [rows] = await this.database.query(
      `SELECT p.*, 
       IFNULL(c.comment_count, 0) AS comment_count, 
       IFNULL(l.like_count, 0) AS like_count, 
       u.*
FROM ${this.table} AS p
INNER JOIN account AS a ON a.id_account = p.id_account_fk
INNER JOIN user AS u ON u.id_user = a.id_user_fk
LEFT JOIN (
    SELECT id_publication_fk, COUNT(*) AS comment_count
    FROM comment
    GROUP BY id_publication_fk
) AS c ON c.id_publication_fk = p.id_publication
LEFT JOIN (
    SELECT id_publication_fk, COUNT(*) AS like_count
    FROM likes
    GROUP BY id_publication_fk
) AS l ON l.id_publication_fk = p.id_publication
GROUP BY p.id_publication, u.id_user
        WHERE id_publication = ?
        `,
      [id]
    );

    // Return the first row of the result, which represents the publication
    return rows[0];
  }

  async readAllPublicationWithAuthor(id) {
    // Execute the SQL SELECT query to retrieve all publications from the "publication" table
    const [rows] = await this.database.query(`SELECT p.*, 
       IFNULL(c.comment_count, 0) AS comment_count, 
       IFNULL(l.like_count, 0) AS like_count, 
       u.*,
       IF(
           EXISTS (
               SELECT 1
               FROM likes
               WHERE id_account_fk = ?
                 AND id_publication_fk = p.id_publication
           ), 
           1, 
           0
       ) AS is_liked
FROM ${this.table} AS p
INNER JOIN account AS a ON a.id_account = p.id_account_fk
INNER JOIN user AS u ON u.id_user = a.id_user_fk
LEFT JOIN (
    SELECT id_publication_fk, COUNT(*) AS comment_count
    FROM comment
    GROUP BY id_publication_fk
) AS c ON c.id_publication_fk = p.id_publication
LEFT JOIN (
    SELECT id_publication_fk, COUNT(*) AS like_count
    FROM likes
    GROUP BY id_publication_fk
) AS l ON l.id_publication_fk = p.id_publication
GROUP BY p.id_publication, u.id_user
ORDER BY p.date_publication DESC;
    `,
  [id]
  );

    // Return the array of publications
    return rows;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing publication

  // async update(publication) {
  //   ...
  // }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an publication by its ID

  // async delete(id) {
  //   ...
  // }
}

module.exports = PublicationRepository;
