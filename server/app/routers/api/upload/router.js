const express = require("express");

const router = express.Router();

const { addPublication } = require("../../../controllers/uploadActions");

router.post("/publication", addPublication);

module.exports = router;