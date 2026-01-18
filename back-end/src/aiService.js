import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Call Google Gemini API with a prompt
 * @param {string} prompt - The prompt to send to Gemini
 * @param {string} modelName - The model name to use (default: 'gemini-2.5-flash')
 * @returns {Promise<string>} - The generated text response
 * @throws {Error} - If API call fails
 */
export async function callGemini(prompt, modelName = 'gemini-2.5-flash') {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables");
    }

    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`AI service error: ${error.message}`);
  }
}

/**
 * Call Google Gemini API with structured output (JSON)
 * @param {string} prompt - The prompt to send to Gemini
 * @param {string} modelName - The model name to use (default: 'gemini-2.5-flash')
 * @returns {Promise<Object>} - The parsed JSON response
 * @throws {Error} - If API call fails or JSON parsing fails
 */
export async function callGeminiJSON(prompt, modelName = 'gemini-2.5-flash') {
  try {
    const textResponse = await callGemini(prompt, modelName);
    // Try to extract JSON from the response (in case it's wrapped in markdown code blocks)
    const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/) || textResponse.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : textResponse;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Gemini JSON parsing error:', error);
    throw new Error(`Failed to parse AI response as JSON: ${error.message}`);
  }
}
