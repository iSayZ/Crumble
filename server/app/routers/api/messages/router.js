const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import like-related actions
const { add } = require("../../../controllers/messageActions");

const { verifyToken, verifyProfileAccess } = require("../../../services/auth");

// Route to add a new like
router.post("/", verifyToken, verifyProfileAccess, add);

/* ************************************************************************* */

module.exports = router;
