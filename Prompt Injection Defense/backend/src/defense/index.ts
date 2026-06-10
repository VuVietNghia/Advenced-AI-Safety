import { sanitizeInput } from './inputSanitizer';
import { detectPatterns } from './patternDetector';
import { classifyIntent } from './intentClassifier';
import { getGuardedMessages } from './contextGuard';
import { validateOutput } from './outputValidator';
import { generateCompletion } from '../llm/lmStudioClient';
import { ChatResponse, DefenseResult } from '../types';

export const stats = {
  layer1_blocks: 0,
  layer2_blocks: 0,
  layer3_blocks: 0,
  layer4_blocks: 0,
  layer5_blocks: 0,
};

export async function processChatRequest(rawInput: string): Promise<ChatResponse> {
  // Layer 1: Input Sanitizer
  const sanitizedInput = sanitizeInput(rawInput);
  if (!sanitizedInput) {
    return createBlockedResponse(1, 'Empty or invalid input after sanitization');
  }

  // Layer 2: Pattern Detector
  const patternResult = detectPatterns(sanitizedInput);
  if (patternResult.blocked) {
    stats.layer2_blocks++;
    return createBlockedResponse(2, patternResult.reason!);
  }

  // Layer 3: Intent Classifier
  const intentResult = await classifyIntent(sanitizedInput);
  if (intentResult.blocked) {
    stats.layer3_blocks++;
    return createBlockedResponse(3, intentResult.reason!);
  }

  // Layer 4: Context Guard
  // (Build the secure messages array)
  const messages = getGuardedMessages(sanitizedInput);

  // --- Call the LLM ---
  let rawOutput = '';
  try {
    rawOutput = await generateCompletion(messages);
  } catch (err) {
    console.error('LLM Error:', err);
    return {
      reply: 'An error occurred while generating the response.',
      blocked: false,
      defenseLog: { layer: null, reason: null }
    };
  }

  // Layer 5: Output Validator
  const outputResult = validateOutput(rawOutput);
  if (outputResult.blocked) {
    stats.layer5_blocks++;
    return {
      reply: outputResult.safeOutput!,
      blocked: true,
      defenseLog: { layer: 5, reason: outputResult.reason! }
    };
  }

  // Success
  return {
    reply: outputResult.safeOutput!,
    blocked: false,
    defenseLog: { layer: null, reason: null }
  };
}

function createBlockedResponse(layer: number, reason: string): ChatResponse {
  return {
    reply: 'Your request was blocked due to safety policies.',
    blocked: true,
    defenseLog: { layer, reason }
  };
}
