import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export const DEFAULT_MODEL = 'gpt-4o';

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY in environment variables');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function createChatCompletion(
  messages: ChatCompletionMessageParam[],
) {
  const openai = getOpenAIClient();
  return openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages,
    temperature: 0.7,
  });
}
