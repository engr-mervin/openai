import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./App.css";
import useWebSocket, { ReadyState } from "react-use-websocket";
import ReactMarkdown from "react-markdown";
interface History {
  type: "prompt" | "result";
  message: string;
}
const WS_URL = "ws://localhost:3000";
function App() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<History[]>([]);
  const [responding, setResponding] = useState(false);

  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log(`Connected to Server!`);
      //Remove loader
    },
  });

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.data === "$$MSG_START") {
        setHistory((prev) => {
          const copy = [...prev];
          copy.push({ type: "result", message: "" });
          return copy;
        });
      } else if (lastMessage.data === "$$MSG_END") {
        setResponding(false);
      } else {
        setHistory((prev) => {
          const copy = [...prev];
          copy[copy.length - 1].message += lastMessage.data;
          return copy;
        });
      }
    }
  }, [lastMessage]);

  function onSubmitQuery(e: FormEvent) {
    e.preventDefault();
    setResponding(true);
    setPrompt("");
    setHistory((prev) => [...prev, { type: "prompt", message: prompt }]);
    sendMessage(prompt);
  }

  function onChangePrompt(e: ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    setPrompt(e.target.value);
  }
  return (
    <div className="app">
      <ul className="result-list">
        {history.map((h, idx) => (
          <li key={idx} className={`result-list-item result-list-item--${h.type}`}>
            <ReactMarkdown className="result-box">{h.message}</ReactMarkdown>
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmitQuery}>
        <textarea onChange={onChangePrompt} value={prompt} className="prompt-input-box"></textarea>
        <button className="prompt-input-button" type="submit" disabled={readyState !== ReadyState.OPEN || responding}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
