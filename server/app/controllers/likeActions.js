// Import access to database tables
const tables = require("../../database/tables");

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the like data from the request body
  const like = req.body;
  try {
    // Insert the like into the database
    const insertId = await tables.likes.create(like);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted like
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    // Delete the like from the database
    await tables.likes.delete(req.params);

    // Respond with HTTP 204 (No Content)
    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  add,
  destroy,
};
