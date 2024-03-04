import { useEffect, useState, useRef } from "react";
import { Button, Input } from "@nextui-org/react";
import "./App.css";

function App() {
  const [live, setLive] = useState(false);
  const [messages, setMessages] = useState("");
  const [file, setFile] = useState("logs.txt");
  const socketRef = useRef(null);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const onStartStream = () => {
    socketRef.current = new WebSocket(`ws://localhost:8080/${file}`);
    setMessages("");
    socketRef.current.onmessage = function (event) {
      const message = event.data.replace(/\n/g, "<br />");
      setMessages((prevMessages) => prevMessages + "<br />" + message);
    };
    setLive(true);
  };

  const onEndStream = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setLive(false);
  };

  const toggleStream = () => {
    if (!live) {
      onStartStream();
      return;
    }
    onEndStream();
  };

  const onChange = event => {
    setFile(event.target.value)
  }

  return (
    <div className="flex-row" style={{width: 600}}>
      <div className="flex w-full md:flex-nowrap mb-6 md:mb-0 gap-4 items-stretch">
        <Input type="text" label="File Name" placeholder="Enter your file name" value={file} onChange={onChange}/>
        <div className="flex items-center">
          <Button onClick={toggleStream} color="primary">
            {live ? "Pause" : "Start"}
          </Button>
        </div>
      </div>
      <div style={{paddingTop: 16}}>
        <p className="font-semibold text-xl">
          Logs
        </p>
      </div>
      <div className="p-2">
        <p className="font-mono" dangerouslySetInnerHTML={{ __html: messages }} />
      </div>
    </div>
  );
}

export default App;
