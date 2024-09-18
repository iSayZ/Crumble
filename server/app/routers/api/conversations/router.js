const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import publication-related actions
const { read } = require("../../../controllers/conversationActions");

const { verifyToken, verifyProfileAccess } = require("../../../services/auth");

// Route to get a specific conversation by ID
router.get("/:id/:idUserSelected", verifyToken, verifyProfileAccess, read);

/* ************************************************************************* */

module.exports = router;
