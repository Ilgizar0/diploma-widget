(function () {

  if (window.__chat_loaded) return;
  window.__chat_loaded = true;

  const socket = io();

  const userId = localStorage.getItem("uid") ||
    Math.random().toString(36).substr(2, 9);

  localStorage.setItem("uid", userId);

  socket.emit("register", userId);

  const html = `
  <div id="chat-box" style="
    position:fixed;
    bottom:20px;
    right:20px;
    width:360px;
    height:500px;
    background:white;
    border:1px solid #ddd;
    display:none;
    flex-direction:column;
    font-family:Arial;
    z-index:99999;
  ">

    <div style="background:#4f46e5;color:white;padding:10px;">
      Чат поддержки 💬
    </div>

    <div id="msgs" style="flex:1;overflow:auto;padding:10px;"></div>

    <input id="name" placeholder="Имя" style="padding:6px;margin:5px;">
    <input id="msg" placeholder="Сообщение" style="padding:6px;margin:5px;">

    <button id="send">Отправить</button>
  </div>

  <button id="open-chat" style="
    position:fixed;
    bottom:20px;
    right:20px;
    padding:14px;
    border-radius:50%;
    background:#4f46e5;
    color:white;
    border:none;
    cursor:pointer;
    z-index:99999;
  ">💬</button>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  const box = document.getElementById("chat-box");
  const open = document.getElementById("open-chat");
  const msgs = document.getElementById("msgs");
  const msg = document.getElementById("msg");
  const name = document.getElementById("name");
  const send = document.getElementById("send");

  open.onclick = () => {
    box.style.display = box.style.display === "flex" ? "none" : "flex";
  };

  send.onclick = () => {

    if (!msg.value) return;

    socket.emit("user-message", {
      userId,
      name: name.value || "Гость",
      text: msg.value
    });

    msg.value = "";
  };

  socket.on("new-message", (data) => {

    const div = document.createElement("div");
    div.style.margin = "6px 0";
    div.style.maxWidth = "80%";

    // 🧑‍💼 ОПЕРАТОР — СЛЕВА
    if (data.from === "operator") {

      div.innerHTML = "🧑‍💼 " + data.name + ": " + data.text;

      div.style.textAlign = "left";
      div.style.marginRight = "auto";
      div.style.background = "#f1f5f9";
      div.style.padding = "6px";
      div.style.borderRadius = "8px";

    } 
    // 👤 ПОЛЬЗОВАТЕЛЬ — СПРАВА
    else {

      div.innerHTML = "👤 " + data.name + ": " + data.text;

      div.style.textAlign = "right";
      div.style.marginLeft = "auto";
      div.style.background = "#dbeafe";
      div.style.padding = "6px";
      div.style.borderRadius = "8px";
    }

    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  });

})();