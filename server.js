const WebSocket = require("ws");

const port = 8080;
let server = null;

console.log(`Server run on port: ${port}`);

const sendMessage = (client, data) => {
  if (client.readyState === WebSocket.OPEN) {
    client.send(data);
    console.log("message send");
  }
};

const sendMessageToAll = data =>
  server.clients.forEach(client => sendMessage(client, data));

const handleMessage = socket => {
  console.log("message rdy to send");
  socket.on("message", data => sendMessageToAll(data));
};

const handleConnection = () => {
  console.log("connection established");
  server.on("connection", socket => handleMessage(socket));
};

const startServer = () => {
  server = new WebSocket.Server({
    port
  });
  handleConnection();
};

startServer();
