// Import access to database tables
const tables = require("../../database/tables");

// The B of BREAD - Browse (Read All) operation
const readCount = async (req, res, next) => {
  try {
    // Fetch all user from the database
    const count = await tables.friend_request.countFriendRequestAndMsg(
      req.params.id
    );

    // Respond with the user in JSON format
    res.json(count);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  readCount,
};
