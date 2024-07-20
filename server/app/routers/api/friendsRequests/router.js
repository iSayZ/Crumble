const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import friend request-related actions
const { add, destroy } = require("../../../controllers/friendRequestActions");

// Route to delete a friend request by ID
router.delete("/:id", destroy);

// Route to add a new friend request
router.post("/", add);

/* ************************************************************************* */

module.exports = router;
