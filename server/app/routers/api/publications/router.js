const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import publication-related actions
const { browse, read, add } = require("../../../controllers/publicationActions");

// Route to get a list of publications
router.get("/all/:id", browse);

// Route to post a publication
router.post("/", add);

// Route to get a specific publication by ID
router.get("/:id", read);

/* ************************************************************************* */

module.exports = router;
