const WebSocket = require("ws");

const port = 8080;
let server = null,
  connectionIdList = [];

console.log(`Server run on port: ${port} !`);

const refreshConnectionIdList = client => {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({connectionIdList}));
  }
}

const sendMessage = (client, data) => {
  if (client.readyState === WebSocket.OPEN) {
    client.send(data);
  }
};

const sendMessageToAll = (data, senderId = null) => {
  if (senderId) {
    console.log(`message from ${senderId} send`);
  }
  server.clients.forEach(client => {
    refreshConnectionIdList(client);
    sendMessage(client, data);
  });
};

const handleMessage = (socket, req) => {
  const senderId = req.headers["sec-websocket-key"],
    data = {
      senderId,
      currentConnectionsSize: server.clients.size
    };
  console.log(`${senderId} connected`);

  if (!connectionIdList.includes(senderId)) 
    connectionIdList.push(senderId);
  
  sendMessageToAll(JSON.stringify(data));
  socket.on("message", data => sendMessageToAll(data, senderId));
};

const handleConnection = () => {
  console.log("connection established");
  server.on("connection", (socket, req) => handleMessage(socket, req));
};

const startServer = () => {
  server = new WebSocket.Server({port});
  handleConnection();
};

startServer();
