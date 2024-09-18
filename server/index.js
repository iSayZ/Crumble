// Load environment variables from .env file
require("dotenv").config();

// Check database connection
// Note: This is optional and can be removed if the database connection
// is not required when starting the application
require("./database/client").checkConnection();

// Import the Express application from app/config.js
const { app, server } = require("./app/config");

const { initSocket } = require("./app/socket");

// Get the port from the environment variables
const port = process.env.APP_PORT;

// Start the server and listen on the specified port
app
  .listen(port, () => {
    console.info(`Server is listening on port ${port}`);
  })
  .on("error", (err) => {
    console.error("Error:", err.message);
  });

// Initialize Socket.IO
const io = initSocket(server);

// Start the server
const PORT = process.env.SOCKET_PORT || 3311;
server.listen(PORT, () => {
  console.info(`Server Socket.IO running on port ${PORT}`);
});

module.exports = { io };
