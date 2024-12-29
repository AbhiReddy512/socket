const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`connected to ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("message_send", (data) => {
    console.log(`message from ${data.username}`)
    socket.to(data.room).emit("receive_message", {
      username: data.username,
      message: data.message,
    });
  });
});

server.listen(3001, () => {
  console.log("server is running on port 3001");
});
