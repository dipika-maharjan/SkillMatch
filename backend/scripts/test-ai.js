import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isRetryable = (err) => {
  const msg = String(err?.message || "").toLowerCase();
  return /quota|rate limit|rate_limit|429|temporarily unavailable|503|502/.test(
    msg,
  );
};

const tryOpenAI = async (messages, model = "gpt-4o-mini") => {
  try {
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model,
      messages,
    });
    const text = completion.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch (err) {
    throw err;
  }
};

const tryOpenRouter = async (messages, model = "openai/gpt-4o-mini") => {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({ model, messages }),
    });

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch (err) {
    throw err;
  }
};

const main = async () => {
  const messages = [
    {
      role: "user",
      content: "Give a one-line resume tip for a frontend developer.",
    },
  ];

  if (process.env.OPENAI_API_KEY) {
    console.log("Trying OpenAI...");
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const text = await tryOpenAI(messages);
        if (text) {
          console.log("OpenAI response:\n", text);
          return;
        }
        throw new Error("Empty OpenAI response");
      } catch (err) {
        console.error(
          `OpenAI attempt ${attempt + 1} failed:`,
          err.message || err,
        );
        if (!isRetryable(err) || attempt === 2) break;
        await sleep(500 * 2 ** attempt);
      }
    }
  }

  if (process.env.OPENROUTER_API_KEY) {
    console.log("Trying OpenRouter...");
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const text = await tryOpenRouter(messages);
        if (text) {
          console.log("OpenRouter response:\n", text);
          return;
        }
        throw new Error("Empty OpenRouter response");
      } catch (err) {
        console.error(
          `OpenRouter attempt ${attempt + 1} failed:`,
          err.message || err,
        );
        if (!isRetryable(err) || attempt === 2) break;
        await sleep(500 * 2 ** attempt);
      }
    }
  }

  console.log(
    "No AI provider configured or all providers failed. Falling back to local guidance.",
  );
};

main().catch((err) => {
  console.error("Test script error:", err);
  process.exit(1);
});
