
import { GoogleGenAI, Chat, Message, Content } from "@google/genai";
import { Message as AppMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = ai.models['gemini-2.5-flash'];

const SYSTEM_INSTRUCTION = `You are a friendly and helpful Healthcare Assistant. You provide general health information. You must always include this disclaimer at the end of your responses, separated by a horizontal rule with three dashes: '--- \n *Disclaimer: This information is for educational purposes only and not a substitute for professional medical advice. Always consult a healthcare provider for any health concerns.*' Your tone should be empathetic, clear, and reassuring. Do not provide diagnostic information or prescribe treatments. Format your answers clearly, using lists, bold text, and paragraphs to improve readability.`;

export const startChat = (history: AppMessage[]): Chat => {
  const formattedHistory: Content[] = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
    history: formattedHistory,
  });

  return chat;
};

export async function* sendMessageStream(
  chat: Chat,
  message: string
): AsyncGenerator<string> {
  const result = await chat.sendMessageStream({ message });
  for await (const chunk of result) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}
