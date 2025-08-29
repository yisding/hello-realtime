import { Hono } from "npm:hono";
import { Webhook } from "npm:svix";
import { makeHeaders, makeSession } from "./utils.ts";

const sip = new Hono();

// POST /sip : webhook endpoint
sip.post("/", async (c) => {
  // Verify the webhook.
  const OPENAI_SIGNING_SECRET = Deno.env.get("OPENAI_SIGNING_SECRET");
  if (!OPENAI_SIGNING_SECRET) {
    console.error("🔴 webhook secret not configured");
    return c.text("Internal error", 500);
  }
  const webhook = new Webhook(OPENAI_SIGNING_SECRET);
  const bodyStr = await c.req.text();
  let callId: string | undefined;
  try {
    const headers = Object.fromEntries(c.req.raw.headers.entries());
    const payload: any = webhook.verify(bodyStr, headers);
    callId = payload.data.call_id;
    console.log("✅ verified webhook:", callId);
  } catch (error) {
    console.error(`🔴 verify failed: ${error}`);
    return c.text("Invalid signature", 401);
  }

  // Accept the call.
  const url = `https://api.openai.com/v1/realtime/calls/${callId}/accept`;
  const headers = makeHeaders("application/json");
  const body = JSON.stringify(makeSession());
  const opts = { method: "POST", headers, body };
  const resp = await fetch(url, opts);
  if (!resp.ok) {
    const errText = await resp.text().catch(() => "<no body>");
    console.error(`🔴 accept failed: ${errText}`);
    return c.text("Internal error", 500);
  }
  console.log("✅ call accepted:", callId);

  // Kick off observer in the background (fire-and-forget).
  const selfUrl = new URL(c.req.url);
  fetch(`${selfUrl.origin}/observer/${callId}`, { method: "POST" })
    .catch((e) => console.error("observer trigger failed:", e));

  return c.newResponse(null);
});

export default sip;