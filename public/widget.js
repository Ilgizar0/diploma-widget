(function () {

    const socket = io();

    let opened = false;

    socket.emit("join", "Guest");

    const ui = document.createElement("div");

    ui.innerHTML = `
    <div id="chatBox" style="
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

        <input id="name" placeholder="Имя" style="padding:5px;">
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

    document.body.appendChild(ui);

    const chatBox = ui.querySelector("#chatBox");
    const openBtn = ui.querySelector("#openBtn");
    const sendBtn = ui.querySelector("#send");
    const text = ui.querySelector("#text");
    const name = ui.querySelector("#name");
    const messages = ui.querySelector("#messages");

    openBtn.onclick = () => {
        opened = !opened;
        chatBox.style.display = opened ? "flex" : "none";
    };

    sendBtn.onclick = () => {

        socket.emit("visitor-message", {
            name: name.value || "Guest",
            message: text.value
        });

        text.value = "";
    };

    socket.on("operator-reply", (msg) => {

        const div = document.createElement("div");
        div.style.margin = "5px";
        div.innerHTML = `<b>Оператор:</b> ${msg.message}`;
        messages.appendChild(div);

        messages.scrollTop = messages.scrollHeight;
    });

})();