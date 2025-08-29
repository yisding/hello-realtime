import { Hono } from "npm:hono";
import WebSocket from "npm:ws";
import { makeHeaders } from "./utils.ts";

const observer = new Hono();

// POST /observer/:callId : self-connect to establish a web socket
observer.post("/:callId", async (c) => {
  const callId = c.req.param("callId");
  const url = `wss://api.openai.com/v1/realtime?call_id=${callId}`;
  const ws = new WebSocket(url, { headers: makeHeaders() });
  ws.on("open", () => {
    console.log("✅ websocket connected");
    setTimeout(() => ws.send(JSON.stringify({ type: "response.create" })), 250);
  });
  ws.on("message", (data /*, isBinary */) => {
    const message = JSON.parse(data);
    if (message.type !== "response.audio_transcript.delta") {
      console.log(message);
    }
  });
  ws.on("error", (err: Error) => {
    console.error(`🔴 websocket failed: ${err.message}`);
  });

  // Respond immediately; WS continues in background
  return c.newResponse(null);
});

export default observer;
