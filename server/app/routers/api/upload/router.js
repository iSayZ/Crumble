const express = require("express");

const router = express.Router();

const {
  addPublication,
  addCoverage,
  addAvatar,
} = require("../../../controllers/uploadActions");
const { edit } = require("../../../controllers/userActions");

// Route for add a publication image
router.post("/publication", addPublication);

// Route for add a coverage image
router.post("/coverage", addCoverage, edit);

// Route for add an avatar image
router.post("/avatar", addAvatar, edit);

module.exports = router;
