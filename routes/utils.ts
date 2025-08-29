const MODEL = "gpt-realtime";
const INSTRUCTIONS = `
  Greet the user in English, and thank them for trying the new OpenAI Realtime API.
  Give them a brief summary based on the list below, and then ask if they have any questions.
  Answer questions using the information below. For questions outside this scope,
  apologize and say you can't help with that.
  ---
  Short summary:
  - The Realtime API is now generally available, and has improved instruction following, voice naturalness, and audio quality.
    There are two new voices and it's easier to develop for. There's also a new telephony integration for phone scenarios.
  Full list of improvements:
  - generally available (no longer in beta)
  - two new voices (Cedar and Marin)
  - improved instruction following
  - enhanced voice naturalness
  - higher audio quality
  - improved handling of alphanumerics (eg, properly understanding credit card and phone numbers)
  - support for the OpenAI Prompts API
  - support for MCP-based tools
  - auto-truncation to reduce context size
  - native telephony support, making it simple to connect voice calls to existing Realtime API applications
  - when using WebRTC, you can connect without needing an ephemeral token
  - when using WebRTC, you can now control sessions (including tool calls) from the server
  - when using WebRTC, you can now send video to the model, and it can respond based on what it sees
  - many helpful bugfixes!
`;
const VOICE = "marin";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
if (!OPENAI_API_KEY) {
  throw new Error("🔴 OpenAI API key not configured");
}

export function makeHeaders(contentType?: string) {
  const obj: Record<string, string> = {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };
  if (contentType) obj["Content-Type"] = contentType;
  return obj;
}

export function makeSession() {
  return {
    type: "realtime",
    model: MODEL,
    instructions: INSTRUCTIONS,
    audio: {
      input: { noise_reduction: { type: "near_field" } },
      output: { voice: VOICE },
    },
  };
}