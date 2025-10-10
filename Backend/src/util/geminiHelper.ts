import  { type NextFunction,type Request,type Response } from 'express'
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
dotenv.config();

const ai = new GoogleGenAI({});
export async function AskGemini(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text
}

