// Import access to database tables
const tables = require("../../database/tables");

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  const { id, idUserSelected } = req.params;
  try {
    // Fetch a specific conversation from the database based on the provided ID
    const conversation = await tables.conversation.getOrCreateConversation(
      id,
      idUserSelected
    );

    // If the conversation is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the conversation in JSON format
    if (conversation == null) {
      res.sendStatus(404);
    } else {
      res.json(conversation);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  read,
};
