// Import access to database tables
const tables = require("../../database/tables");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  const {
    startDefault = 0,
    limitDefault = 10,
    sort = "id",
    order = "ASC",
    ...filters
  } = req.query;
  const start = parseInt(startDefault, 10);
  const limit = parseInt(limitDefault, 10);

  try {
    // Fetch all publication from the database
    let publications = await tables.publication.readAll();

    // Apply the filters
    Object.keys(filters).forEach((key) => {
      publications = publications.filter((item) => item[key] === filters[key]);
    });

    // Sort the results
    publications.sort((a, b) => {
      if (order === "ASC") {
        return a[sort] > b[sort] ? 1 : -1;
      } 
      return a[sort] < b[sort] ? 1 : -1;
    });

    // Paginate the results
    const paginatedData = publications.slice(start, start + limit);

    // Send the response
    res.set("X-Total-Count", publications.length);
    res.json(paginatedData);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The B of BREAD - browseById (Read All with ID) operation
const browseById = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Fetch all publication from the database
    const publications =
      await tables.publication.readAllPublicationWithAuthor(id);

    // Respond with the publication in JSON format
    res.json(publications);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const browsePublicationsProfile = async (req, res, next) => {
  try {
    // Fetch a specific publication from the database based on the provided ID
    const publicationsProfile = await tables.publication.readPublicationProfile(
      req.params.id
    );

    // If the publication is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the publication in JSON format
    if (publicationsProfile == null) {
      res.sendStatus(404);
    } else {
      res.json(publicationsProfile);
    }
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
const edit = async (req, res, next) => {
  // Extract the publication data from the request body and params
  const publication = req.body;

  try {
    // Update the publication in the database
    await tables.publication.update(publication);

    // Respond with HTTP 204 (No Content)
    res.status(200).json({ data: { id: publication.id_publication } });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

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
const destroy = async (req, res, next) => {
  const id = req.params.idPublication;
  try {
    // Delete the comment from the database
    await tables.publication.delete(id);

    // Respond with HTTP 204 (No Content)
    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  browseById,
  browsePublicationsProfile,
  read,
  edit,
  add,
  destroy,
};
