const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Import And Use Routers Here
/* ************************************************************************* */

const itemsRouter = require("./items/router");

router.use("/items", itemsRouter);

// Road publications
const publicationsRouter = require("./publications/router");

router.use("/publications", publicationsRouter);

// Road users
const usersRouter = require("./users/router");

router.use("/users", usersRouter);

// Road friendship
const friendshipsRouter = require("./friendships/router");

router.use("/friendships", friendshipsRouter);

// Road friend_request
const friendsRequestsRouter = require("./friendsRequests/router");

router.use("/friends-requests", friendsRequestsRouter);

// Road like
const likesRequestsRouter = require("./likes/router");

router.use("/likes", likesRequestsRouter);

// Road login
const authActions = require("../../controllers/authActions");

router.post("/login", authActions.login);

// Road upload
const uploadRouter = require("./upload/router");

router.use("/upload", uploadRouter)

/* ************************************************************************* */

module.exports = router;
