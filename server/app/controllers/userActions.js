// Import access to database tables
const tables = require("../../database/tables");

// The B of BREAD - Browse (Read All) operation
const browseForAdmin = async (req, res, next) => {
  try {
    // Fetch all user from the database
    const users = await tables.user.readAll();

    // Respond with the user in JSON format
    res.json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The B of BREAD - Browse (Read All) operation
const browseFriend = async (req, res, next) => {
  try {
    // Fetch all user from the database
    const users = await tables.user.readAllFriendById(req.params.id);

    // Respond with the user in JSON format
    res.json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The B of BREAD - Browse (Read All) operation
const browseFriendBySearch = async (req, res, next) => {
  try {
    // Fetch all user from the database
    const users = await tables.user.readAllFriendBySearch(
      req.params.id,
      req.params.query
    );

    // Respond with the user in JSON format
    res.json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The B of BREAD - Browse (Read All) operation
const browseFriendSuggestion = async (req, res, next) => {
  try {
    // Fetch all user from the database
    const users = await tables.user.readAllForSuggestion(req.params.id);

    // Respond with the user in JSON format
    res.json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const browseFriendRequest = async (req, res, next) => {
  try {
    // Fetch a specific user from the database based on the provided ID
    const user = await tables.user.readFriendRequestById(req.params.id);

    // If the user is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the user in JSON format
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific user from the database based on the provided ID
    const user = await tables.user.read(req.params.id);

    // If the user is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the user in JSON format
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const readAccountDetails = async (req, res, next) => {
  try {
    // Fetch a specific user from the database based on the provided ID
    const user = await tables.user.read(req.params.id);

    // If the user is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the user in JSON format
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, _) => {
  // Extract the user data from the request body and params
  const user = req.body;

  try {
    // Update the user in the database
    await tables.user.updateUser(user);

    // Respond with HTTP 204 (No Content)
    res.sendStatus(200);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    res.status(400).json({
      succes: false,
      message: "Erreur lors de la modification du profil...",
    });
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the user data from the request body
  const user = req.body.formData;

  try {
    // Insert the user into the database
    const insertId = await tables.user.create(user);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted user
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    if (err === 1062) {
      next(
        res
          .status(500)
          .json({ error: "Cette adresse e-mail est déjà utilisée." })
      );
    } else {
      next(
        res.status(500).json({ error: "Erreur lors de la création du compte." })
      );
    }
  }
};

// The D of BREAD - Destroy (Delete) operation
// This operation is not yet implemented

// Ready to export the controller functions
module.exports = {
  browseForAdmin,
  browseFriend,
  browseFriendBySearch,
  browseFriendSuggestion,
  browseFriendRequest,
  read,
  readAccountDetails,
  edit,
  add,
};
