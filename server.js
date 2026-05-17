const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {}; // userId -> socket.id

io.on("connection", (socket) => {

  socket.on("register", (userId) => {
    users[userId] = socket.id;
    socket.userId = userId;

    io.emit("users", Object.keys(users));
  });

  // 👤 пользователь
  socket.on("user-message", (data) => {

    if (!data.userId || !data.text) return;

    io.emit("new-message", {
      userId: data.userId,
      name: data.name || "Гость",
      text: data.text,
      from: "user"
    });
  });

  // 🧑‍💼 оператор
  socket.on("operator-message", (data) => {

    if (!data.userId || !data.text) return;

    const socketId = users[data.userId];

    if (socketId) {
      io.to(socketId).emit("new-message", {
        userId: data.userId,
        name: "ОПЕРАТОР",
        text: data.text,
        from: "operator"
      });
    }

  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      delete users[socket.userId];
      io.emit("users", Object.keys(users));
    }
  });

});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});