import ReactMarkdown from "react-markdown";
import { History } from "../App";
import "./MessageHistory.css";

interface MessageHistoryProps {
  history: History[];
}

function MessageHistory({ history }: MessageHistoryProps) {
  return (
    <ul className="message-list">
      {history.map((h, idx) => (
        <li key={idx} className={`message-item type--${h.type}`}>
          <ReactMarkdown className="message-box">{h.message}</ReactMarkdown>
        </li>
      ))}
    </ul>
  );
}

export default MessageHistory;
