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

const readFromEnd = async (path, lines) => {
	try {
		const stats = await fsPromise.stat(path);
		let position = stats.size;
		const bufferSize = 100
		const buffer = Buffer.alloc(bufferSize);
		let lineCount = 0;
		let content = []
		let fileDescriptor = await fsPromise.open(path, "r");

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

		fileDescriptor.close();
		return [content, stats.size];
	} catch (err) {
		console.error("An error occurred:", err);
	}
};

const listenRead = async (path, sendUpdates) => {
	// Watch for changes in the file
	fs.watch(path, (eventType) => {
		if (eventType === "change") {
			readFile(path, files[path].lastReadPostion, (content, end) => {
				files[path].lastReadPostion = end;
				sendUpdates(content)
			});
		}
	});
};

const onDisconnect = async (path, clientId) => {
	files[path].clients = files[path].clients.filter(r => r.clientId !== clientId)
	// delete file buffer if no clients connected for this file
	if (files[path].clients.length === 0 ) {
		delete files[path]
	}
}

const initFileBuffer = async (path) => {
	const isFirstLoad = !files.hasOwnProperty(path)
	// Initialize the reader
	if (isFirstLoad) {
		const [content, position] = await readFromEnd(path, 10)
		files[path] = {
			lastReadPostion: position,
			content: content,
			clients: []
		}
		listenRead(path, content => {
			files[path].clients.forEach(client => {
				client.callBack(content)
			})
		})
	}
}

const subscribeFile = async (path, clientId, onRead) => {
	files[path].clients.push({
		clientId: clientId,
		callBack: onRead
	})
	// Sending the first message of the subscription i.e last 10 lines from the buffer
	onRead(files[path].content)
}

module.exports = {
	onDisconnect,
	initFileBuffer,
	subscribeFile
};
