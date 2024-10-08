// Import the repository modules responsible for handling data operations on the tables
const PublicationRepository = require("./models/PublicationRepository");
const UserRepository = require("./models/UserRepository");
const AccountRepository = require("./models/AccountRepository");
const FriendshipRepository = require("./models/FriendshipRepository");
const FriendRequestRepository = require("./models/FriendRequestRepository");
const LikeRepository = require("./models/LikeRepository");
const CommentRepository = require("./models/CommentRepository");
const ConversationRepository = require("./models/ConversationRepository");
const MessageRepository = require("./models/MessageRepository");
const NotificationRepository = require("./models/NotificationRepository");

// Create an empty object to hold data repositories for different tables
const tables = {};

/* ************************************************************************* */
// Register data repositories for tables
/* ************************************************************************* */

// Register each repository as data access point for its table
tables.publication = new PublicationRepository();
tables.user = new UserRepository();
tables.account = new AccountRepository();
tables.friendship = new FriendshipRepository();
tables.friend_request = new FriendRequestRepository();
tables.likes = new LikeRepository();
tables.comment = new CommentRepository();
tables.conversation = new ConversationRepository();
tables.message = new MessageRepository();
tables.notification = new NotificationRepository();

/* ************************************************************************* */

// Use a Proxy to customize error messages when trying to access a non-existing table

// Export the Proxy instance with custom error handling
module.exports = new Proxy(tables, {
  get(obj, prop) {
    // Check if the property (table) exists in the tables object
    if (prop in obj) return obj[prop];

    // If the property (table) does not exist, throw a ReferenceError with a custom error message
    throw new ReferenceError(
      `tables.${prop} is not defined. Did you register it in ${__filename}?`
    );
  },
});
