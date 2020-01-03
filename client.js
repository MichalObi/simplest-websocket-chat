const connectionUrl = "ws://localhost:8080";

let connection = null,
  sendBtn = null;

const connectionStates = {
  open: "OPEN",
  close: "CLOSE",
  error: "ERROR"
};

const connectionStatesMsg = {
  [connectionStates.open]: "Connection is now open.",
  [connectionStates.close]: "Connection closed now.",
  [connectionStates.error]: "Error occured. More info: "
};

const handleConnectionStateChange = (state, event = "") =>
  console.log(connectionStatesMsg[state], event);

const handleSend = e => {
  const name = document.querySelector("#name"),
    msg = document.querySelector("#message"),
    data = {
      name: name.value || null,
      msg: msg.value || null
    };

  connection.send(JSON.stringify(data));

  name.value = "";
  msg.value = "";
};

const addEventListeners = () => {
  sendBtn = document.querySelector("#send");
  sendBtn.addEventListener("click", handleSend);
};

const handleMessageDisplay = ({name, msg}) => {
  const chat = document.querySelector("#chat"),
    chatData = `<p>From: ${name}, Message: ${msg}</p>`;
  chat.insertAdjacentHTML("beforeend", chatData);
};

const initConnectionsHandler = () => {
  connection.onopen = () => handleConnectionStateChange(connectionStates.open);
  connection.onclose = () =>
    handleConnectionStateChange(connectionStates.close);
  connection.onerror = error =>
    handleConnectionStateChange(connectionStates.open, error);
  connection.onmessage = ({data}) => handleMessageDisplay(JSON.parse(data));
};

const connectClient = () => {
  connection = new WebSocket(connectionUrl);
  initConnectionsHandler();
};

const initClient = () => {
  connectClient();
  addEventListeners();
};

initClient();
