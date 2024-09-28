import "./App.css";
import { useState } from "react";
import useWebSocket from "react-use-websocket";
import MessageHistory from "./components/MessageHistory";
import PromptForm from "./components/PromptForm";
export interface History {
  type: "prompt" | "result";
  message: string;
}

const WS_URL = "ws://localhost:3000";

function App() {
  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log(`Connected to Server!`);
    },
  });
  const [history, setHistory] = useState<History[]>([]);
  return (
    <div className="app">
      <MessageHistory history={history}></MessageHistory>
      <PromptForm sendMessage={sendMessage} lastMessage={lastMessage} readyState={readyState} changeHistory={setHistory}></PromptForm>
    </div>
  );
}

export default App;
