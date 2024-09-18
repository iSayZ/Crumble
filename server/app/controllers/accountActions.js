// Import access to database tables
const tables = require("../../database/tables");

// The R of BREAD - Read operation
const readAccountDetails = async (req, res, next) => {
  try {
    // Fetch a specific user from the database based on the provided ID
    const accountDetails = await tables.account.readAccountWithUser(
      req.params.id
    );
    // If the user is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the user in JSON format
    if (accountDetails == null) {
      res.sendStatus(404);
    } else {
      res.json(accountDetails);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const readProfileDetails = async (req, res, next) => {
  try {
    // Fetch a specific user from the database based on the provided ID
    const profileDetails = await tables.account.readProfile(req.params);
    // If the user is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the user in JSON format
    if (profileDetails == null) {
      res.sendStatus(404);
    } else {
      res.json(profileDetails);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const editAccount = async (req, res, _) => {
  // Extract the account data from the request body and params
  const account = req.body;

  try {
    // Update the account in the database
    await tables.account.updateAccount(account);

    // Respond with HTTP 204 (No Content)
    res.sendStatus(200);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    res
      .status(400)
      .json({ succes: false, message: "Ancien mot de passe incorrect !" });
  }
};

// Ready to export the controller functions
module.exports = {
  readAccountDetails,
  readProfileDetails,
  editAccount,
};
