const WebSocket = require("ws");
const listenRead = require("./reader");

const filename = "logs.txt";
const port = 8080;

const wss = new WebSocket.Server({port: port}, () => {
    console.log(`WebSocket server running on port ${port}`);
});

wss.on("connection", (ws) => {
    listenRead(filename, (content) => {
        ws.send(content);
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
