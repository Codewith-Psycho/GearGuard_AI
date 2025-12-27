
import { GoogleGenAI } from "@google/genai";

// Fix: Strictly follow initialization guidelines for GoogleGenAI by using process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIResponse = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      // Fix: Use gemini-3-pro-preview for complex reasoning and technical maintenance advice
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are GearGuard AI, a futuristic maintenance assistant.
        You provide high-priority maintenance advice.
        Be concise, professional, and technical.
        Always suggest preventive actions based on current health data (e.g., CNC-3 85% risk).`,
        temperature: 0.7,
      }
    });
    // Fix: Correctly access the .text property (not a method)
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently calibrating my sensors. Please try again in a moment.";
  }
};
