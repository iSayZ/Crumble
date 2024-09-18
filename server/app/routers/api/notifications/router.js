const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import notification-related actions
const {
  readAll,
  destroy,
} = require("../../../controllers/notificationActions");

const { verifyToken, verifyProfileAccess } = require("../../../services/auth");

// Route to get all notification by account ID
router.get("/:id", verifyToken, verifyProfileAccess, readAll);

// Route to delete a notification by ID
router.delete(
  "/:id/:idNotification",
  verifyToken,
  verifyProfileAccess,
  destroy
);

/* ************************************************************************* */

module.exports = router;
