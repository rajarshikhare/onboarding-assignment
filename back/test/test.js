
const assert = require('assert');
const WebSocket = require('ws');
const sinon = require('sinon');
const fs = require('fs');
const { spawn } = require('child_process');

describe('WebSocket Server', function() {
    let serverProcess;
    let wsClient;

    before(function(done) {
        // Start the server in a child process
        serverProcess = spawn('node', ['server.js']);

        serverProcess.stdout.on('data', (data) => {
            console.log(`Server: ${data}`);
            done();
        });

        serverProcess.stderr.on('data', (data) => {
            console.error(`Server error: ${data}`);
        });

        // Create or clear the logs.txt file
        fs.writeFileSync('logs.txt', '');
    });

    after(function() {
        serverProcess.kill(); // Stop the server process
        fs.unlinkSync('logs.txt'); // Clean up the logs.txt file
    });

    afterEach(function() {
        wsClient.removeAllListeners('message');
    })

    it('should send last 10 lines of log file to connected clients', function(done) {
        // Append simulated log data to the logs.txt file
        let simulatedLogData = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10\n';
        fs.appendFileSync('logs.txt', simulatedLogData);

        wsClient = new WebSocket('ws://localhost:8080');

        wsClient.on('open', () => {
            wsClient.on('message', function(message) {
                assert.strictEqual(String(message), simulatedLogData);
                done();
            });
        });

    });

    it('should send updated data as the log file is appended', function(done) {
        const updateData = 'Line 11\nLine 12\n';

        // Listen for the update message
        wsClient.on('message', function(message) {
            assert.strictEqual(String(message), updateData);
            done();
        });

        // Append more data to simulate a file update
        fs.appendFileSync('logs.txt', updateData);
    });
});


