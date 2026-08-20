import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;

export const getGeminiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  return geminiClient;
};

interface SafeGenerateOptions {
  prompt: string;
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
  maxRetries?: number;
}

/**
 * Resilient multi-model generation with automatic model fallback chain and backoff.
 * Seamlessly handles 503 (model high demand / UNAVAILABLE) and 429 (rate limits / RESOURCE_EXHAUSTED).
 */
export async function generateContentSafe(
  options: SafeGenerateOptions
): Promise<string | null> {
  const ai = getGeminiClient();
  if (!ai) {
    return null;
  }

  // Active models according to current Gemini API specs:
  const modelsToTry = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.1-pro-preview",
  ];

  for (const model of modelsToTry) {
    try {
      const response: GenerateContentResponse =
        await ai.models.generateContent({
          model,
          contents: options.prompt,
          config: {
            systemInstruction: options.systemInstruction,
            responseMimeType: options.responseMimeType,
            temperature: options.temperature ?? 0.3,
          },
        });

      const text = response.text?.trim();
      if (text) {
        return text;
      }
    } catch (err: any) {
      const statusCode = err?.status || err?.code;
      const errMsg = err?.message || String(err);
      
      const isCapacityOrQuotaError =
        statusCode === 503 ||
        statusCode === 429 ||
        errMsg.includes("503") ||
        errMsg.includes("429") ||
        errMsg.includes("high demand") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("quota");

      console.warn(
        `Gemini attempt with model "${model}" encountered error (${errMsg}). Falling back to next available model.`
      );

      // Brief jitter delay before trying next fallback model
      if (isCapacityOrQuotaError) {
        await new Promise((res) => setTimeout(res, 200));
      }
    }
  }

  return null;
}

