const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Import And Use Routers Here
/* ************************************************************************* */

// Road publications
const publicationsRouter = require("./publications/router");

router.use("/publications", publicationsRouter);

// Road users
const usersRouter = require("./users/router");

router.use("/users", usersRouter);

// Road accounts
const accountsRouter = require("./accounts/router");

router.use("/accounts", accountsRouter);

// Road friendship
const friendshipsRouter = require("./friendships/router");

router.use("/friendships", friendshipsRouter);

// Road friend_request
const friendsRequestsRouter = require("./friendsRequests/router");

router.use("/friends-requests", friendsRequestsRouter);

// Road like
const likesRequestsRouter = require("./likes/router");

router.use("/likes", likesRequestsRouter);

// Road comment
const commentsRouter = require("./comments/router");

router.use("/comments", commentsRouter);

// Road notification
const notificationsRouter = require("./notifications/router");

router.use("/notifications", notificationsRouter);

// Road conversation
const conversationsRouter = require("./conversations/router");

router.use("/conversations", conversationsRouter);

// Message conversation
const messagesRouter = require("./messages/router");

router.use("/messages", messagesRouter);

// Road login
const authActions = require("../../controllers/authActions");

router.post("/login", authActions.login);

// Road upload
const uploadRouter = require("./upload/router");

router.use("/upload", uploadRouter);

// Road searching
const searchingRouter = require("./searching/router");

router.use("/search", searchingRouter);

// Road count
const countsRouter = require("./counts/router");

router.use("/count", countsRouter);

/* ************************************************************************* */

module.exports = router;
