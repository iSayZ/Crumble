// Import access to database tables
const tables = require("../../database/tables");

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the friendRequest data from the request body
  const friendRequest = req.body;
  try {
    // Insert the friendRequest into the database
    const insertId = await tables.friend_request.create(friendRequest);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted friendRequest
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    // Delete the friendRequest from the database
    await tables.friend_request.delete(req.params.idFriendRequest);

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
