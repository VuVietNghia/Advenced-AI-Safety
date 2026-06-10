export function detectPatterns(input: string): { blocked: boolean; reason?: string } {
  const normalizedInput = input.toLowerCase();

  // 1. Jailbreak & Role overrides
  const roleOverridePatterns = [
    /ignore (all )?previous (instructions|directions)/i,
    /you are now/i,
    /act as (a )?/i,
    /from now on/i,
    /forget everything/i,
  ];

  for (const pattern of roleOverridePatterns) {
    if (pattern.test(normalizedInput)) {
      return { blocked: true, reason: 'Detected role override attempt' };
    }
  }

  // 2. System prompt leak attempts
  const leakPatterns = [
    /what is your system prompt/i,
    /repeat your (instructions|rules)/i,
    /output your prompt/i,
    /show me your instructions/i,
    /system directive/i,
  ];

  for (const pattern of leakPatterns) {
    if (pattern.test(normalizedInput)) {
      return { blocked: true, reason: 'Detected system prompt extraction attempt' };
    }
  }

  // 3. Known Jailbreak Names
  const jailbreakNames = ['dan', 'aim', 'stan', 'dev mode'];
  for (const name of jailbreakNames) {
    // Check whole word match
    const regex = new RegExp(`\\b${name}\\b`, 'i');
    if (regex.test(normalizedInput)) {
      return { blocked: true, reason: `Detected known jailbreak template keyword: ${name}` };
    }
  }

  // 4. Delimiter injection
  const delimiterPatterns = [
    /system_boundary/i, // Trying to spoof the context guard
    /\[inst\]/i,
    /<\/?s>/i,
    /<\|im_start\|>/i,
  ];

  for (const pattern of delimiterPatterns) {
    if (pattern.test(normalizedInput)) {
      return { blocked: true, reason: 'Detected delimiter injection attempt' };
    }
  }

  return { blocked: false };
}
