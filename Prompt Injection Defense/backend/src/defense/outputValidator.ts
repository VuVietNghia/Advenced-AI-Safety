export function validateOutput(output: string): { blocked: boolean; reason?: string; safeOutput?: string } {
  const normalizedOutput = output.toLowerCase();

  // Check if model leaked system prompt phrases
  const systemLeakKeywords = [
    'you are a helpful, respectful, and honest ai assistant',
    'primary directive is to provide',
    'under no circumstances should you reveal'
  ];

  for (const keyword of systemLeakKeywords) {
    if (normalizedOutput.includes(keyword)) {
      return { 
        blocked: true, 
        reason: 'Model output intercepted: Potential system instruction leak detected',
        safeOutput: "I'm sorry, I cannot fulfill that request."
      };
    }
  }

  // Check if model adopted a banned persona
  const bannedPersonas = ['i am dan', 'as dan', 'i am aim'];
  for (const persona of bannedPersonas) {
    if (normalizedOutput.includes(persona)) {
      return {
        blocked: true,
        reason: 'Model output intercepted: Adopted restricted persona',
        safeOutput: "I'm sorry, I cannot act in that capacity."
      };
    }
  }

  return { blocked: false, safeOutput: output };
}
