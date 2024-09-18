const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import publication-related actions
const {
  browse,
  browseById,
  browsePublicationsProfile,
  read,
  edit,
  add,
  destroy,
} = require("../../../controllers/publicationActions");

const { verifyToken, verifyProfileAccess } = require("../../../services/auth");

// Route to get a list of publications for a specific user by Account ID
router.get("/all/:id", browseById);

// Route to get a list of profile publications by ID
router.get("/profile/:id", browsePublicationsProfile);

// Route to update a specific publication by ID
router.put("/", verifyToken, verifyProfileAccess, edit);

// Route to get a specific publication by ID
router.get("/:id", read);

// Route to post a publication
router.post("/", verifyToken, verifyProfileAccess, add);

// Route to delete a specific publication by ID
router.delete("/:id/:idPublication", verifyToken, verifyProfileAccess, destroy);

/* ************************************************************************* */

// Route for AdminPanel
router.get("/", verifyToken, verifyProfileAccess, browse);

/* ************************************************************************* */

module.exports = router;
