import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY as string;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in .env file");
}

export const genAI = new GoogleGenerativeAI(apiKey);
