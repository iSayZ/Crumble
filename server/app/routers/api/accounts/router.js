const express = require("express");

const router = express.Router();

/* ************************************************************************* */

const {
  verifyToken,
  verifyProfileAccess,
  hashChangePassword,
} = require("../../../services/auth");

const {
  readAccountDetails,
  readProfileDetails,
  editAccount,
} = require("../../../controllers/accountActions");

// Route to get all informations of user and his account by account ID
router.get("/:id", verifyToken, verifyProfileAccess, readAccountDetails);

// Route to get all informations of user and his account by account ID
router.get(
  "/profile/:profile_consulted/:profile_connected",
  readProfileDetails
);

// Route to update account informations by account ID
router.put(
  "/:id",
  verifyToken,
  verifyProfileAccess,
  hashChangePassword,
  editAccount
);

/* ************************************************************************* */

module.exports = router;
