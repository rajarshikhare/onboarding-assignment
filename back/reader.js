const fs = require("fs");
const util = require("util");

// Convert fs methods to return promises
const fsOpen = util.promisify(fs.open);
const fsRead = util.promisify(fs.read);
const fsClose = util.promisify(fs.close);
const fsStat = util.promisify(fs.stat);

const readFile = (path, start, onRead) => {
    const readStream = fs.createReadStream(path, {start: start});

    readStream.on("data", (chunk) => {
        onRead(chunk.toString(), start + chunk.byteLength);
    });

    readStream.on("error", (err) => {
        console.error("An error occurred:", err);
    });
};

const readFromEnd = async (path, onRead, lines) => {
    try {
        const stats = await fsStat(path);
        let position = stats.size;
        const buffer = Buffer.alloc(1);
        let lineCount = 0;
        let content = "";
        let fileDescriptor = await fsOpen(path, "r");

        while (position > 0 && lineCount <= lines) {
            position -= 1;
            const {bytesRead} = await fsRead(
                fileDescriptor,
                buffer,
                0,
                1,
                position,
            );
            if (bytesRead > 0) {
                const data = buffer.toString("utf8", 0, bytesRead);
                if (data === "\n") {
                    lineCount++;
                }
                if (lineCount <= lines) {
                    content = data + content; // Prepend to keep the order correct
                }
            }
        }

        await fsClose(fileDescriptor);
        onRead(content, stats.size);
    } catch (err) {
        console.error("An error occurred:", err);
    }
};

const listenRead = (path, onRead) => {
    let start = 0;
    // Read last 10 lines
    readFromEnd(
        path,
        (content, end) => {
            // console.log("Sending first lines...")
            start = end;
            onRead(content);
        },
        10,
    );

    // Watch for changes in the file
    fs.watch(path, (eventType) => {
        if (eventType === "change") {
            readFile(path, start, (content, end) => {
                // console.log("Sending updates...")
                start = end;
                onRead(content);
            });
        }
    });
};

module.exports = listenRead;
