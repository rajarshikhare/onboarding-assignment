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

const readFromEnd = async (path, onRead, lines) => {
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
		onRead(content, stats.size);
	} catch (err) {
		console.error("An error occurred:", err);
	}
};

const listenRead = async (path) => {
	const sendContent = (content) => {
		files[path].content = files[path].content.slice(content.length).concat(content)
		files[path].clients.forEach(client => {
			client.callBack(content)
		})
	}

	let start = 0;
	// Read last 10 lines
	await readFromEnd(
		path,
		(content, end) => {
			start = end;
			sendContent(content);
		},
		10,
	);

	// Watch for changes in the file
	fs.watch(path, (eventType) => {
		if (eventType === "change") {
			readFile(path, start, (content, end) => {
				start = end;
				sendContent(content);
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

const readBuffer = async (path, clientId, onRead) => {
	const isFirstLoad = !files.hasOwnProperty(path)
	// Initialize the reader
	if (isFirstLoad) {
		files[path] = {
			content: [],
			clients: []
		}
		await listenRead(path)
	}
	files[path].clients.push({
		clientId: clientId,
		callBack: onRead
	})
	// Send the first 10 lines from buffer
	onRead(files[path].content)
}

module.exports = {
	onDisconnect,
	readBuffer
};