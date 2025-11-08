import OpenAI from "openai";

let openaiClient = null;

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not set. Please add it to your environment variables."
    );
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openaiClient;
}

export const OPENAI_MODEL = {
  TEXT: process.env.OPENAI_MODEL_TEXT || "gpt-4.1-mini",
  INSIGHT: process.env.OPENAI_MODEL_INSIGHT || "gpt-4.1-mini",
  IMAGE: process.env.OPENAI_MODEL_IMAGE || "gpt-image-1",
};

