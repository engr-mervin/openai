import "dotenv/config";
import express, { Request } from "express";
import { Duplex } from "stream";
import { uuid } from "uuidv4";
import { WebSocketServer, WebSocket } from "ws";
import OpenAI from "openai";
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

  if (!!req.headers["BadAuth"]) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

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

  ws.on("error", onSocketPostError);

  ws.on("message", async (msg, isBinary) => {
    if (ws.readyState === WebSocket.OPEN) {
      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: msg.toString() }],
        stream: true,
      });
      for await (const chunk of stream) {
        ws.send(chunk.choices[0]?.delta?.content || "");
      }
    }
  });

  ws.on("close", (statusCode, reason) => {
    console.log(`Client deleted: ${clientId}`);
    clients.delete(clientId);
  });
});
