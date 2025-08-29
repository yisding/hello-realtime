import { Hono } from "npm:hono";
import { makeHeaders, makeSession } from "./utils.ts";

const rtc = new Hono();

// POST /rtc : create a new call
rtc.post("/", async (c) => {
  // Create the call.
  const url = "https://api.openai.com/v1/realtime/calls";
  const headers = makeHeaders();
  const fd = new FormData();
  fd.set("sdp", await c.req.text());
  fd.set("session", JSON.stringify(makeSession()));
  const opts = { method: "POST", headers, body: fd };
  const resp = await fetch(url, opts);
  if (!resp.ok) {
    const errText = await resp.text().catch(() => "<no body>");
    console.error(`🔴 start call failed: ${resp.status} ${errText}`);
    return c.text("Internal error", 500);
  }

  const contentType = resp.headers.get("Content-Type");
  const location = resp.headers.get("Location");
  const callId = location?.split("/").pop();
  console.log("✅ call created:", callId);

  // Kick off observer in the background (fire-and-forget).
  const selfUrl = new URL(c.req.url);
  fetch(`${selfUrl.origin}/observer/${callId}`, { method: "POST" });

  return c.newResponse(resp.body, {
    headers: { "Content-Type": contentType },
  });
});

export default rtc;
