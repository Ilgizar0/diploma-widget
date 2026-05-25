const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};        // активные пользователи
let messages = {};     // сообщения по каждому пользователю

io.on("connection", (socket) => {

    // пользователь заходит
    socket.on("join", (name) => {

        users[socket.id] = {
            id: socket.id,
            name: name
        };

        if (!messages[socket.id]) {
            messages[socket.id] = [];
        }

        io.emit("users", users);
    });

    // сообщение от пользователя
    socket.on("visitor-message", (data) => {

        if (!messages[socket.id]) {
            messages[socket.id] = [];
        }

        messages[socket.id].push({
            from: "user",
            name: data.name,
            message: data.message,
            time: new Date().toLocaleTimeString()
        });

        io.emit("new-message", {
            userId: socket.id,
            ...messages[socket.id].slice(-1)[0]
        });
    });

    // сообщение от оператора
    socket.on("operator-message", (data) => {

        if (!messages[data.userId]) {
            messages[data.userId] = [];
        }

        messages[data.userId].push({
            from: "operator",
            name: "Оператор",
            message: data.message,
            time: new Date().toLocaleTimeString()
        });

        io.to(data.userId).emit("operator-reply", {
            name: "Оператор",
            message: data.message,
            time: new Date().toLocaleTimeString()
        });

    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("users", users);
    });

});

server.listen(3000, () => {
    console.log("Server running on 3000");
});