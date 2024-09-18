const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import user-related actions
const {
  browseForAdmin,
  browseFriend,
  browseFriendBySearch,
  browseFriendSuggestion,
  browseFriendRequest,
  read,
  edit,
  add,
} = require("../../../controllers/userActions");

const {
  hashPassword,
  verifyToken,
  verifyProfileAccess,
} = require("../../../services/auth");

// Route to get all users for /** ADMIN PANEL **/
router.get("/", verifyToken, verifyProfileAccess, browseForAdmin);

// Route to get a list of friends by account ID
router.get("/friends/:id", verifyToken, verifyProfileAccess, browseFriend);

// Route to get a list of friends by search
router.get(
  "/friends/search/:id/:query",
  verifyToken,
  verifyProfileAccess,
  browseFriendBySearch
);

// Route to get a list of friends suggestions by account ID
router.get(
  "/friends/suggestions/:id",
  verifyToken,
  verifyProfileAccess,
  browseFriendSuggestion
);

// Route to get a list of friends requests by account ID
router.get(
  "/friends/requests/:id",
  verifyToken,
  verifyProfileAccess,
  browseFriendRequest
);

// Route to get a specific user by account ID
router.get("/:id", read);

// Route to update an user by user ID
router.put("/:id", verifyToken, verifyProfileAccess, edit);

// Route to create a new user
router.post("/", hashPassword, add);

/* ************************************************************************* */

module.exports = router;
