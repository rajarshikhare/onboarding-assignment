const fsPromise = require("fs/promises");
const fs = require("fs");

let files = {}

const readFile = (path, start, onRead) => {
	const readStream = fs.createReadStream(path, { start: start });

	readStream.on("data", (chunk) => {
		onRead(chunk.toString().split("\n").filter(s => s), start + chunk.byteLength);
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
			const bytesToRead = position > bufferSize ? bufferSize : position
			position -= bytesToRead
			const { bytesRead } = await fileDescriptor.read(
				buffer,
				0,
				bytesToRead,
				position,
			);
			if (bytesRead > 0) {
				const data = buffer.toString("utf8", 0, bytesRead);
				content.push(...data.split("\n").slice(-10))
				if (content.length >= lines) {
					break
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
				files[path].content = files[path].content.slice(content.length)
				files[path].content.push(...content)
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
