// Import access to database tables
const tables = require("../../database/tables");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Fetch all publication from the database
    const publications = await tables.publication.readAllPublicationWithAuthor(id);

    // Respond with the publication in JSON format
    res.json(publications);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific publication from the database based on the provided ID
    const publication = await tables.publication.read(req.params.id);

    // If the publication is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the publication in JSON format
    if (publication == null) {
      res.sendStatus(404);
    } else {
      res.json(publication);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
// This operation is not yet implemented

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the publication data from the request body
  const publication = req.body;

  try {
    // Insert the publication into the database
    const insertId = await tables.publication.create(publication);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted publication
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
// This operation is not yet implemented

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  // edit,
  add,
  // destroy,
};
