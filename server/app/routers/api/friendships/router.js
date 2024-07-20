const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import friendship-related actions
const { add } = require("../../../controllers/friendshipActions");

// Route to add a new friend
router.post("/", add);

/* ************************************************************************* */

module.exports = router;
