import fs from 'fs';
import path from 'path';

let cachedSystemPrompt: string | null = null;

export function getGuardedMessages(userInput: string) {
  if (!cachedSystemPrompt) {
    const promptPath = path.join(__dirname, '../prompts/system.md');
    try {
      cachedSystemPrompt = fs.readFileSync(promptPath, 'utf8').trim();
    } catch (e) {
      console.error('Failed to load system prompt:', e);
      cachedSystemPrompt = 'You are a helpful and safe AI assistant.';
    }
  }

  // Wrap the system prompt with boundaries
  const securedSystemPrompt = `
<SYSTEM_BOUNDARY>
${cachedSystemPrompt}
</SYSTEM_BOUNDARY>
  `.trim();

  // Create a clean, single-turn context array
  return [
    { role: 'system' as const, content: securedSystemPrompt },
    { role: 'user' as const, content: userInput }
  ];
}
