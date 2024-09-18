const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import comment-related actions
const { destroy, edit, add } = require("../../../controllers/commentActions");

const { verifyToken, verifyProfileAccess } = require("../../../services/auth");

// Route to update a specific comment by ID
router.put("/", verifyToken, verifyProfileAccess, edit);

// Route to delete a specific comment by comment ID
router.delete("/:id/:idComment", verifyToken, verifyProfileAccess, destroy);

// Route to add a new comment
router.post("/", verifyToken, verifyProfileAccess, add);

/* ************************************************************************* */

module.exports = router;
