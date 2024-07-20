const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import like-related actions
const { destroy, add } = require("../../../controllers/likeActions");

// Route to get a specific like by publication ID and account ID
router.delete("/:id_publication/:id_account", destroy);

// Route to add a new like
router.post("/", add);

/* ************************************************************************* */

module.exports = router;
