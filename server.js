const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};
let messages = {};

io.on("connection", (socket) => {

    console.log("connected:", socket.id);

    // вход пользователя
    socket.on("join", (name) => {

        users[socket.id] = {
            id: socket.id,
            name: name || "Guest"
        };

        if (!messages[socket.id]) {
            messages[socket.id] = [];
        }

        io.emit("users", users);
    });

    // сообщение клиента
    socket.on("visitor-message", (data) => {

        const msg = {
            userId: socket.id,
            from: "user",
            name: users[socket.id]?.name || data.name || "Guest",
            message: data.message
        };

        if (!messages[socket.id]) messages[socket.id] = [];
        messages[socket.id].push(msg);

        io.emit("new-message", msg);

        // показать самому пользователю
        socket.emit("own-message", msg);
    });

    // сообщение оператора
    socket.on("operator-message", (data) => {

        const msg = {
            userId: data.userId,
            from: "operator",
            name: "Оператор",
            message: data.message
        };

        if (!messages[data.userId]) messages[data.userId] = [];
        messages[data.userId].push(msg);

        io.to(data.userId).emit("operator-reply", msg);
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("users", users);
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on", PORT);
});