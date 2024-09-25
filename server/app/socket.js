// socket.js
const { Server } = require("socket.io");
const axios = require("axios");

// Store connected users
const activeUsers = new Map();

const socketConversations = new Map(); // Map to store conversations by socket.id

// Function to initialize Socket.IO
const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL, // URL of client
      methods: ["GET", "POST"],
    },
  });

  // Handle user connections
  io.on("connection", (socket) => {
    console.info(`Utilisateur ${socket.id} est connecté.`);

    socket.on("userConnected", (userId) => {
      if (!activeUsers.has(userId)) {
        activeUsers.set(userId, socket.id);
        console.info(`Utilisateur connecté avec ID : ${userId}`);
      }
      console.info(`Utilisateurs actifs : `, activeUsers);
    });

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.info(
        `Utilisateur ${socket.id} a rejoint la conversation ${conversationId}`
      );

      // Add the conversation to the list of conversations for this socket
      if (!socketConversations.has(socket.id)) {
        socketConversations.set(socket.id, new Set());
      }
      socketConversations.get(socket.id).add(conversationId);
      console.info("USER CONVERSATION => ", socketConversations);
    });

    socket.on("leaveConversation", (conversationId) => {
      socket.leave(conversationId);
      console.info(
        `Utilisateur ${socket.id} a quitté la conversation ${conversationId}`
      );

      // Update socketConversations
      if (socketConversations.has(socket.id)) {
        socketConversations.get(socket.id).delete(conversationId);

        // Remove the entry if no conversation is associated with this socket
        if (socketConversations.get(socket.id).size === 0) {
          socketConversations.delete(socket.id);
        }
      }
    });

    socket.on(
      "sendMessage",
      async ({ conversationId, sender, text, token }) => {
        if (!conversationId || !sender || !text) {
          console.error("conversationId, sender, or text is not defined");
          return;
        }
        try {
          const response = await axios.post(
            `http://localhost:${process.env.APP_PORT}/api/messages`,
            {
              conversationId,
              id_account: sender,
              content: text,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const savedMessage = response.data;
          io.to(conversationId).emit("receiveMessage", savedMessage);
        } catch (error) {
          console.error(
            "Erreur lors de l'appel à l'API de création de message :",
            error
          );
        }
      }
    );

    socket.on("disconnect", () => {
      activeUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          activeUsers.delete(userId);
          console.info(`Utilisateur avec ID : ${userId} est déconnecté.`);
          console.info(`Utilisateurs actifs : `, activeUsers);
        }
      });
    });    
  });

  return io;
};

module.exports = { initSocket, activeUsers, socketConversations };
