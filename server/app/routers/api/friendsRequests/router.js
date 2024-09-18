const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import friend request-related actions
const { add, destroy } = require("../../../controllers/friendRequestActions");

const { verifyToken, verifyProfileAccess } = require("../../../services/auth");

// Route to delete a friend request by ID
router.delete(
  "/:id/:idFriendRequest",
  verifyToken,
  verifyProfileAccess,
  destroy
);

// Route to add a new friend request
router.post("/", verifyToken, verifyProfileAccess, add);

/* ************************************************************************* */

module.exports = router;
