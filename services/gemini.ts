import { GoogleGenAI, Content, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";
import { getConfig } from "./api";

const systemInstruction = "You are a friendly and knowledgeable anime expert. Your goal is to help users find new anime, discuss episodes, and answer any questions they have about the world of anime. Keep your responses concise and engaging, using markdown for formatting when appropriate.";

// Helper to get initialized AI client safely
const getAiClient = () => {
    // Attempt to get key from Env (Build time) OR Config (Runtime Frontend)
    const config = getConfig();
    const apiKey = process.env.API_KEY || config.geminiApiKey;
    
    if (!apiKey) {
        throw new Error("API Key missing. Please configure 'Gemini API Key' in Admin Settings.");
    }
    
    return new GoogleGenAI({ apiKey });
};

export const generateAiChatResponse = async (history: ChatMessage[], newPrompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Map ChatMessage[] to the Content[] format required by the SDK.
    const chatHistory: Content[] = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));
    
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: chatHistory,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    
    const response: GenerateContentResponse = await chat.sendMessage({ message: newPrompt });
    
    // Access the response text via the .text getter property.
    return response.text || "I couldn't generate a text response.";

  } catch (error: any) {
    console.error("Gemini API error:", error);
    
    if (error.message?.includes("API Key missing")) {
        return "⚠️ Configuration Error: Please add your Gemini API Key in the Admin Settings page to use the AI Assistant.";
    }
    
    return "I'm sorry, I encountered an error while processing your request. Please try again later.";
  }
};