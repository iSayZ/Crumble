const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import friendship-related actions
const {
  add,
  destroyFriendship,
} = require("../../../controllers/friendshipActions");

const { verifyToken, verifyProfileAccess } = require("../../../services/auth");

// Route to add a new friendship
router.post("/:id", verifyToken, verifyProfileAccess, add);

// Route to delete a friendship
router.delete(
  "/:id/:idFriendship",
  verifyToken,
  verifyProfileAccess,
  destroyFriendship
);

/* ************************************************************************* */

module.exports = router;
