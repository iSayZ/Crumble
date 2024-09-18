const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import like-related actions
const { destroy, add } = require("../../../controllers/likeActions");

const { verifyToken, verifyProfileAccess } = require("../../../services/auth");

// Route to get a specific like by publication ID and account ID
router.delete(
  "/:id_publication/:id",
  verifyToken,
  verifyProfileAccess,
  destroy
);

// Route to add a new like
router.post("/", verifyToken, verifyProfileAccess, add);

/* ************************************************************************* */

module.exports = router;
