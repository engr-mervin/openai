import "dotenv/config";
import express, { Request } from "express";
import { Duplex } from "stream";
import { uuid } from "uuidv4";
import { WebSocketServer, WebSocket } from "ws";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
const openai = new OpenAI();
const app = express();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

function onSocketPreError(e: Error) {
  console.log("PRE WS", e.message);
}
function onSocketPostError(e: Error) {
  console.log("POST WS", e.message);
}

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req: Request, socket: Duplex, head: Buffer) => {
  socket.on("error", onSocketPreError);

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req);
    console.log(`Server upgraded to WS`);
  });
});

const clients = new Map();

wss.on("connection", (ws, req) => {
  const clientId = uuid();
  clients.set(clientId, ws);
  console.log(`Client added: ${clientId}`);
  const messages: ChatCompletionMessageParam[] = [];
  ws.on("error", onSocketPostError);

  ws.on("message", async (msg, _) => {
    if (ws.readyState === WebSocket.OPEN) {
      messages.push({ role: "user", content: msg.toString() });
      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        stream: true,
      });

      ws.send("$$MSG_START");
      for await (const chunk of stream) {
        ws.send(chunk.choices[0]?.delta?.content || "");
      }
      ws.send("$$MSG_END");
    }
  });

  ws.on("close", (statusCode, reason) => {
    console.log(`Client deleted: ${clientId}`);
    console.log(`Socket closed: ${statusCode}, ${reason}`);
    clients.delete(clientId);
  });
});
