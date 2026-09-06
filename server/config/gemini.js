import { GoogleGenAI } from '@google/genai';

console.log("key loaded:", process.env.GEMINI_API_KEY ? "yes" : "no undefined")
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


export const geminiModel = ai;
export const MODEL_NAME = 'gemini-3-flash-preview';