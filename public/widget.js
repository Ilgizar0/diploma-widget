(function () {

    const socket = io();

    let opened = false;

    socket.emit("join", "");

    const root = document.createElement("div");

    root.innerHTML = `
        <div id="chat" style="
            position:fixed;
            bottom:20px;
            right:20px;
            width:280px;
            height:360px;
            background:#fff;
            border:1px solid #ccc;
            display:none;
            flex-direction:column;
            font-family:Arial;
        ">
            <div id="messages" style="flex:1;overflow:auto;padding:10px;"></div>

            <input id="name" placeholder="Ваше имя" style="padding:5px;">
            <input id="text" placeholder="Сообщение" style="padding:5px;">
            <button id="send">Отправить</button>
        </div>

        <button id="openBtn" style="
            position:fixed;
            bottom:20px;
            right:20px;
            padding:10px;
        ">Chat</button>
    `;

    document.body.appendChild(root);

    const chat = root.querySelector("#chat");
    const openBtn = root.querySelector("#openBtn");
    const sendBtn = root.querySelector("#send");
    const nameInput = root.querySelector("#name");
    const textInput = root.querySelector("#text");
    const messages = root.querySelector("#messages");

    openBtn.onclick = () => {
        opened = !opened;
        chat.style.display = opened ? "flex" : "none";
    };

    sendBtn.onclick = () => {

        socket.emit("visitor-message", {
            name: nameInput.value || "Guest",
            message: textInput.value
        });

        textInput.value = "";
    };

    socket.on("own-message", (msg) => {
        const div = document.createElement("div");
        div.style.textAlign = "right";
        div.innerHTML = `<b>Я:</b> ${msg.message}`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    });

    socket.on("operator-reply", (msg) => {
        const div = document.createElement("div");
        div.style.textAlign = "left";
        div.innerHTML = `<b>Оператор:</b> ${msg.message}`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    });

})();