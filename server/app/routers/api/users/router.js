const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import user-related actions
const { browseFriendSuggestion, readFriendRequest, read, add } = require("../../../controllers/userActions");

// Route to get a list of friends suggestions
router.get("/friends/suggestions/:id", browseFriendSuggestion);

// Route to get a list of friends requests
router.get("/friends/requests/:id", readFriendRequest);

// Route to get a specific user by ID
router.get("/:id", read);

// Route to create a new user
const { hashPassword } = require("../../../services/auth")

router.post("/", hashPassword, add);

/* ************************************************************************* */

module.exports = router;
