const express = require("express");

const router = express.Router();

const { readCount } = require("../../../controllers/countActions");

const { verifyToken, verifyProfileAccess } = require("../../../services/auth");

// Route to count messages / friend request
router.get("/:id", verifyToken, verifyProfileAccess, readCount);

module.exports = router;
