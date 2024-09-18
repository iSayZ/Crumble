const express = require("express");

const router = express.Router();

const {
  searchUserAndPublication,
} = require("../../../controllers/searchingActions");

// Route for search a publication or user
router.get("/:id/:query", searchUserAndPublication);

module.exports = router;
