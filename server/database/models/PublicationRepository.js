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
       ) AS is_liked,
       COALESCE(
           (
               SELECT JSON_ARRAYAGG(
                   JSON_OBJECT(
                       'id_comment', cm.id_comment,
                       'id_account_fk', cm.id_account_fk,
                       'date_comment', cm.date_comment,
                       'content', cm.content,
                       'user', JSON_OBJECT(
                           'id_user', u2.id_user,
                           'sex', u2.sex,
                           'firstname', u2.firstname,
                           'lastname', u2.lastname,
                           'birthdate', u2.birthdate,
                           'biography', u2.biography,
                           'country', u2.country,
                           'avatar', u2.avatar
                       )
                   )
               )
               FROM comment cm
               INNER JOIN account acc ON acc.id_account = cm.id_account_fk
               INNER JOIN user u2 ON u2.id_user = acc.id_user_fk
               WHERE cm.id_publication_fk = p.id_publication
           ), 
           JSON_ARRAY()
       ) AS comments
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
WHERE id_publication = ?
GROUP BY p.id_publication, u.id_user
ORDER BY p.date_publication DESC;
        `,
      [id, id]
    );

    // Return the first row of the result, which represents the publication
    return rows[0];
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all publications from the "publication" table
    const [rows] = await this.database.query(
      `SELECT p.*,
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
ORDER BY p.date_publication DESC;
    `,
      []
    );

    // Return the array of publications
    return rows;
  }

  async readAllPublicationWithAuthor(id) {
    // Execute the SQL SELECT query to retrieve all publications from the "publication" table
    const [rows] = await this.database.query(
      `SELECT p.*, 
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
       ) AS is_liked,
       COALESCE(
           (
               SELECT JSON_ARRAYAGG(
                   JSON_OBJECT(
                       'id_comment', cm.id_comment,
                       'id_account_fk', cm.id_account_fk,
                       'date_comment', cm.date_comment,
                       'content', cm.content,
                       'user', JSON_OBJECT(
                           'id_user', u2.id_user,
                           'sex', u2.sex,
                           'firstname', u2.firstname,
                           'lastname', u2.lastname,
                           'birthdate', u2.birthdate,
                           'biography', u2.biography,
                           'country', u2.country,
                           'avatar', u2.avatar
                       )
                   )
               )
               FROM comment cm
               INNER JOIN account acc ON acc.id_account = cm.id_account_fk
               INNER JOIN user u2 ON u2.id_user = acc.id_user_fk
               WHERE cm.id_publication_fk = p.id_publication
           ), 
           JSON_ARRAY()
       ) AS comments
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

  async readPublicationProfile(id) {
    // Execute the SQL SELECT query to retrieve all publications from the "publication" table
    const [rows] = await this.database.query(
      `SELECT p.*, 
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
       ) AS is_liked,
       COALESCE(
           (
               SELECT JSON_ARRAYAGG(
                   JSON_OBJECT(
                       'id_comment', cm.id_comment,
                       'id_account_fk', cm.id_account_fk,
                       'date_comment', cm.date_comment,
                       'content', cm.content,
                       'user', JSON_OBJECT(
                           'id_user', u2.id_user,
                           'sex', u2.sex,
                           'firstname', u2.firstname,
                           'lastname', u2.lastname,
                           'birthdate', u2.birthdate,
                           'biography', u2.biography,
                           'country', u2.country,
                           'avatar', u2.avatar
                       )
                   )
               )
               FROM comment cm
               INNER JOIN account acc ON acc.id_account = cm.id_account_fk
               INNER JOIN user u2 ON u2.id_user = acc.id_user_fk
               WHERE cm.id_publication_fk = p.id_publication
           ), 
           JSON_ARRAY()
       ) AS comments
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
 WHERE p.id_account_fk = ?
GROUP BY p.id_publication, u.id_user
ORDER BY p.date_publication DESC;
    `,
      [id, id]
    );

    // Return the array of publications
    return rows;
  }

  async readAllUserAndPublicationBySearch(id, query) {
    // Connection at the database for transaction
    const connection = await this.database.getConnection();

    try {
      await connection.beginTransaction();

      // Retrieve all publications matching the query
      const [publications] = await connection.execute(
        `
           SELECT p.*, 
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
       ) AS is_liked,
       COALESCE(
           (
               SELECT JSON_ARRAYAGG(
                   JSON_OBJECT(
                       'id_comment', cm.id_comment,
                       'id_account_fk', cm.id_account_fk,
                       'date_comment', cm.date_comment,
                       'content', cm.content,
                       'user', JSON_OBJECT(
                           'id_user', u2.id_user,
                           'sex', u2.sex,
                           'firstname', u2.firstname,
                           'lastname', u2.lastname,
                           'birthdate', u2.birthdate,
                           'biography', u2.biography,
                           'country', u2.country,
                           'avatar', u2.avatar
                       )
                   )
               )
               FROM comment cm
               INNER JOIN account acc ON acc.id_account = cm.id_account_fk
               INNER JOIN user u2 ON u2.id_user = acc.id_user_fk
               WHERE cm.id_publication_fk = p.id_publication
           ), 
           JSON_ARRAY()
       ) AS comments
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
 WHERE p.content LIKE ?
GROUP BY p.id_publication, u.id_user
ORDER BY p.date_publication DESC;
         `,
        [id, `%${query}%`]
      );

      // Retrieve information about the selected user
      const [users] = await connection.execute(
        `
            SELECT 
                u.*, a_friend.id_account,
                (
                    SELECT COUNT(*)
                    FROM (
                        SELECT id_account_2 AS friend_id FROM friendship WHERE id_account_1 = ?
                        UNION
                        SELECT id_account_1 AS friend_id FROM friendship WHERE id_account_2 = ?
                    ) AS user_friends
                    JOIN (
                        SELECT id_account_2 AS friend_id FROM friendship WHERE id_account_1 = a_friend.id_account
                        UNION
                        SELECT id_account_1 AS friend_id FROM friendship WHERE id_account_2 = a_friend.id_account
                    ) AS friend_friends
                    ON user_friends.friend_id = friend_friends.friend_id
                ) AS friendship_common
            FROM 
                user AS u
            JOIN 
                account AS a_friend ON a_friend.id_user_fk = u.id_user
            WHERE a_friend.id_account != ?
                AND u.firstname LIKE ? OR u.lastname LIKE ?;
        `,
        [id, id, id, `%${query}%`, `%${query}%`]
      );

      await connection.commit();

      return {
        publications,
        users,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing publication
  async update(publication) {
    // Execute the SQL UPDATE query to update a specific publication
    const [result] = await this.database.query(
      `update ${this.table} set content = ? where id_publication = ?`,
      [publication.content, publication.id_publication]
    );

    // Return how many rows were affected
    return result.affectedRows;
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an publication by its ID
  async delete(id) {
    // Connection at the database for transaction
    const connection = await this.database.getConnection();

    try {
      // Begin the transaction
      await connection.beginTransaction();

      // Execute the first request for delete the likes of publication
      await connection.execute(
        "DELETE FROM likes WHERE id_publication_fk = ?",
        [id]
      );

      // Execute the second request for delete the comments of publication
      await connection.execute(
        "DELETE FROM comment WHERE id_publication_fk = ?",
        [id]
      );

      // Execute the third request for delete the comments of publication
      await connection.execute(
        "DELETE FROM notification WHERE id_publication_fk = ?",
        [id]
      );

      // Execute the last request for delete the publication
      const [result4] = await connection.execute(
        "DELETE FROM publication WHERE id_publication = ?",
        [id]
      );

      // Commit the transaction if all queries succeed
      await connection.commit();

      // Return the ID of the deleted publication
      console.info("Publication deleted successfully");
      return result4.affectedRows;
    } catch (error) {
      // Rollback the transaction in case of an error
      await connection.rollback();

      // Return number error
      console.error("Error on deleted publication =>", error);
      throw error.errno;
    } finally {
      // Close the connection
      await connection.release();
    }
  }
}

module.exports = PublicationRepository;
