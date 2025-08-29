import { Hono } from "npm:hono";
import {
  readFile,
  serveFile,
} from "https://esm.town/v/std/utils@85-main/index.ts";
// import mcp from "./routes/mcp.ts";
import rtc from "./routes/rtc.ts";
import observer from "./routes/observer.ts";

const app = new Hono();
app.route("/rtc", rtc);
app.route("/observer", observer);
// app.route("/mcp", mcp);

app.get("/", async (c) => {
  const html = await readFile("/frontend/index.html", import.meta.url);
  return c.html(html);
});

export default app.fetch;
