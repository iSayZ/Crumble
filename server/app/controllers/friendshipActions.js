// Import access to database tables
const tables = require("../../database/tables");

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the friendship data from the request body
  const friendship = req.body;
  try {
    // Insert the friendship into the database
    const insertId = await tables.friendship.create(friendship);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted friendship
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  add,
  // destroy,
};
