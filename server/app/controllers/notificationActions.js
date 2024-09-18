// Import access to database tables
const tables = require("../../database/tables");

// The R of BREAD - Read operation
const readAll = async (req, res, next) => {
  try {
    // Fetch a specific notification from the database based on the provided ID
    const notification = await tables.notification.readAllByAccountId(
      req.params.id
    );

    // If the notification is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the notification in JSON format
    if (notification == null) {
      res.sendStatus(404);
    } else {
      res.json(notification);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    // Delete the notification from the database
    await tables.notification.delete(req.params.idNotification);

    // Respond with HTTP 204 (No Content)
    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  readAll,
  destroy,
};
