const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
  defaultHeaders: {
    "HTTP-Referer": "https://notesphere.app",
    "X-Title": "NoteSphere",
  }
});

// Use the first model from env or fallback to a reliable free model
const models = process.env.GEMINI_MODELS ? process.env.GEMINI_MODELS.split(",") : [];
const DEFAULT_MODEL = models.length > 0 ? models[0] : "google/gemini-2.0-flash-exp:free";

module.exports = { openai, DEFAULT_MODEL };

