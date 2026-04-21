const { openai, DEFAULT_MODEL } = require("../config/ai.config");
const Setting = require("../models/Setting");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");


/**
 * Handle AI Chat with multi-model fallback logic
 */
const chatWithAI = asyncHandler(async (req, res) => {

  const { message, history = [] } = req.body;

  if (!message) {
    throw new ApiError(400, "Message is required to consult the Nexus.");
  }

  const settings = await Setting.findOne();
  const primaryModel = settings?.activeModel || DEFAULT_MODEL;

  const tryRequest = async (model) => {
    return await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are NoteSphere AI, a premium academic assistant. You help students with their studies, explain complex concepts, and provide guidance on academic topics. Keep your tone professional, encouraging, and highly academic."
        },
        ...history,
        { role: "user", content: message }
      ],
    });
  };

  let response;
  const modelsToTry = [
    primaryModel, 
    DEFAULT_MODEL, 
    "openrouter/free",
    "google/gemma-3-27b-it:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-3-12b-it:free",
    "qwen/qwen3-coder:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "nousresearch/hermes-3-llama-3.1-405b:free"
  ];

  
  // Remove duplicates
  const uniqueModels = [...new Set(modelsToTry)];

  let lastError;
  for (const model of uniqueModels) {
    try {
      console.log(`[Nexus AI] Attempting model: ${model}`);
      response = await tryRequest(model);
      if (response) {
        console.log(`[Nexus AI] Success with model: ${model}`);
        break;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      console.warn(`[Nexus AI] Model ${model} failed (${err.status}): ${errorMsg}`);
      lastError = err;
      
      // If it's a 429 (Rate Limit), we definitely want to try the next model
      // If it's a 404 (Not Found), it might be renamed, try next
      continue;
    }
  }


  if (!response) {
    throw lastError || new Error("All AI models failed to respond.");
  }

  res.status(200).json({
    success: true,
    reply: response.choices[0].message.content
  });
});

module.exports = {
  chatWithAI
};
