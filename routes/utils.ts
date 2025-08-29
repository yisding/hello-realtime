const MODEL = "gpt-realtime";
const INSTRUCTIONS = `Greet the user in English.`;
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

export function makeSession(video: boolean) {
  const session = {
    type: "realtime",
    model: MODEL,
    instructions: INSTRUCTIONS,
    audio: {
      input: { noise_reduction: { type: "near_field" } },
      output: { voice: VOICE },
    },
  };

  if (video) {
    session["video"] = {
      input: { enabled: true },
    };
  }

  return session;
}
