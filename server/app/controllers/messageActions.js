// Import access to database tables
const tables = require("../../database/tables");

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the message data from the request body
  const message = req.body;
  try {
    // Insert the message into the database
    const insertId = await tables.message.create(message);

    // Renvoyer le message nouvellement créé
    res.status(201).json({
      id_message: insertId,
      id_conversation: message.conversationId,
      id_sender: parseInt(message.id_account, 10),
      content: message.content,
      date_message: new Date(),
    });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  add,
};
