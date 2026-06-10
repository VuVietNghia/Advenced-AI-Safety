import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.LM_STUDIO_URL || 'http://localhost:1234/v1';
const apiKey = process.env.LM_STUDIO_API_KEY || 'lm-studio';

// Create the OpenAI client to connect to LM Studio
export const lmStudioClient = new OpenAI({
  baseURL,
  apiKey,
});

/**
 * Generate completion using LM Studio
 * It's model-agnostic, we can pass a dummy model name or 'local-model'
 */
export async function generateCompletion(messages: OpenAI.Chat.ChatCompletionMessageParam[], maxTokens?: number): Promise<string> {
  try {
    const response = await lmStudioClient.chat.completions.create({
      model: 'local-model', // LM Studio often ignores this and uses the loaded model
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('LM Studio API Error:', error);
    throw new Error('Failed to communicate with LM Studio.');
  }
}
