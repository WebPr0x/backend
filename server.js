const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let messageHistory = []; // Store last 20 messages

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  // Send last 20 messages to new client
  socket.emit("chat history", messageHistory);

  socket.on("chat message", (msg) => {
    if (msg && msg.username && msg.message) {
      const data = {
        id: socket.id.slice(0, 5),
        username: msg.username,
        message: msg.message
      };

      // Add to history
      messageHistory.push(data);
      if (messageHistory.length > 20) {
        messageHistory.shift();
      }

      io.emit("chat message", data); // Broadcast to all clients
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
