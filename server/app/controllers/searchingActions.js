// Import access to database tables
const tables = require("../../database/tables");

// The B of BREAD - Browse (Read All) operation
const searchUserAndPublication = async (req, res, next) => {
  try {
    // Fetch all user from the database
    const result = await tables.publication.readAllUserAndPublicationBySearch(
      req.params.id,
      req.params.query
    );

    // Respond with the user in JSON format
    res.json(result);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  searchUserAndPublication,
};
