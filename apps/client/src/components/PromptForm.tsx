import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { ReadyState, SendMessage } from "react-use-websocket";
import { type History } from "../App";
import "./PromptForm.css";

interface PromptFormProps {
  changeHistory: Dispatch<SetStateAction<History[]>>;
  sendMessage: SendMessage;
  lastMessage: MessageEvent<unknown> | null;
  readyState: ReadyState;
}

function PromptForm({ changeHistory, sendMessage, lastMessage, readyState }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");

  function onSubmitQuery(e: FormEvent) {
    e.preventDefault();
    setResponding(true);
    changeHistory((prev) => {
      setPrompt("");
      return [...prev, { type: "prompt", message: prompt }];
    });
    sendMessage(prompt);
  }

  function onChangePrompt(e: ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    setPrompt(e.target.value);
  }
  useEffect(() => {
    //For improvement
    if (lastMessage) {
      if (lastMessage.data === "$$MSG_START") {
        changeHistory((prev) => {
          const copy = [...prev];
          copy.push({ type: "result", message: "" });
          return copy;
        });
      } else if (lastMessage.data === "$$MSG_END") {
        setResponding(false);
      } else {
        changeHistory((prev) => {
          const copy = [...prev];
          copy[copy.length - 1].message += lastMessage.data;
          return copy;
        });
      }
    }
  }, [lastMessage]);

  const [responding, setResponding] = useState(false);
  return (
    <form className="prompt__form" onSubmit={onSubmitQuery}>
      <textarea onChange={onChangePrompt} value={prompt} className="prompt__input"></textarea>
      <button className="prompt__button" type="submit" disabled={readyState !== ReadyState.OPEN || responding}>
        Send
      </button>
    </form>
  );
}

export default PromptForm;
