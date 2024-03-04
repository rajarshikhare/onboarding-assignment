const WebSocket = require('ws');
const http = require('http');
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const { onDisconnect, subscribeFile, initFileBuffer } = require('./reader');

const port = 8080;

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(404);
    res.end();
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

    ws.on('close', () => {
        console.log('Client disconnected');
        onDisconnect(filename, clientId)
    });
});

// Handle upgrade requests
server.on('upgrade', (request, socket, head) => {
    const pathname = url.parse(request.url).pathname;

    // Extract filename from pathname, e.g., "/logs.txt" => "logs.txt"
    const filename = pathname ? pathname.slice(1) : '';

    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request, filename);
    });
});

server.listen(port, () => {
    console.log(`HTTP and WebSocket server running on port ${port}`);
});
