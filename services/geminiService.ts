import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

export const getShoppingAdvice = async (query: string, products: Product[]): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
        return "Sorry, the AI assistant is currently offline (Missing API Key).";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Create a context string about available products
    const productContext = products.map(p => `${p.name} ($${p.price})`).join(', ');

    const prompt = `
      You are a helpful shopping assistant for Dherkiinlay Supermarket.
      Current available products: ${productContext}.
      
      User Query: "${query}"
      
      Please provide a helpful, short, and friendly response. If the user asks for a recipe, suggest one using available items if possible.
      Format the response as plain text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm having trouble connecting to the brain right now.";
  }
};
