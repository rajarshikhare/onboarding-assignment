const WebSocket = require('ws');
const http = require('http');
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const { onDisconnect, subscribeFile, initFileBuffer } = require('./reader');

const filename = "logs.txt";
const port = 8080;

const wss = new WebSocket.Server({port: port}, () => {
    console.log(`WebSocket server running on port ${port}`);
});

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', async (ws, request, filename) => {
    // Generate a unique ID for the client
    const clientId = uuidv4();

    // Init the file buffer here the buffer has realtime file content with last 10 lines
    await initFileBuffer(filename, clientId)

    // Subscribe to the file changes 
    subscribeFile(filename, clientId, (content) => {
        ws.send(content.join("\n"));
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
