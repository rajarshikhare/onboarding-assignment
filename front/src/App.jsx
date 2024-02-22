import { useEffect, useState, useRef } from "react";
import { Button } from "@nextui-org/react";
import "./App.css";

function App() {
  const [live, setLive] = useState(false);
  const [messages, setMessages] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const onStartStream = () => {
    socketRef.current = new WebSocket("ws://localhost:8080");
    setMessages("");
    socketRef.current.onmessage = function (event) {
      const message = event.data.replace(/\n/g, "<br />");
      setMessages((prevMessages) => prevMessages + message);
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

  return (
    <div className="flex-row">
      <div>
        <Button onClick={toggleStream} color="primary">
          {live ? "Pause" : "Start"}
        </Button>
      </div>
      <div className="p-4">
        <div dangerouslySetInnerHTML={{ __html: messages }} />
      </div>
    </div>
  );
}

export default App;
