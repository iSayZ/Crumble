// Import access to database tables
const tables = require("../../database/tables");

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  // Extract the comment data from the request body and params
  const comment = req.body;

  try {
    // Update the comment in the database
    await tables.comment.update(comment);

    // Respond with HTTP 204 (No Content)
    res.sendStatus(200);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the comment data from the request body
  const comment = req.body;
  try {
    // Insert the comment into the database
    const insertId = await tables.comment.create(comment);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted comment
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (delete) operation
const destroy = async (req, res, next) => {
  const id = req.params.idComment;
  try {
    // Delete the comment from the database
    await tables.comment.delete(id);

    // Respond with HTTP 204 (No Content)
    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  edit,
  add,
  destroy,
};
