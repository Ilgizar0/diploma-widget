const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};       // активные пользователи
let messages = {};    // история диалогов по userId

io.on("connection", (socket) => {

    console.log("connected:", socket.id);

    // пользователь подключается
    socket.on("join", (name) => {

        users[socket.id] = {
            id: socket.id,
            name
        };

        if (!messages[socket.id]) {
            messages[socket.id] = [];
        }

        io.emit("users", users);
    });

    // сообщение от клиента
    socket.on("visitor-message", (data) => {

        const msg = {
            userId: socket.id,
            from: "user",
            name: data.name || "Guest",
            message: data.message,
            time: Date.now()
        };

        if (!messages[socket.id]) messages[socket.id] = [];
        messages[socket.id].push(msg);

        io.emit("new-message", msg);
    });

    // сообщение от оператора
    socket.on("operator-message", (data) => {

        const msg = {
            userId: data.userId,
            from: "operator",
            name: "Оператор",
            message: data.message,
            time: Date.now()
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