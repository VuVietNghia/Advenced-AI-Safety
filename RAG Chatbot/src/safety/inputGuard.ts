export interface InputGuardResult {
  safe: boolean;
  reason?: string;
  sanitized: string;
}

// Patterns that indicate prompt injection attempts
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+instructions/i,
  /forget\s+(everything|all|your\s+instructions)/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /act\s+as\s+(if\s+you\s+are|a|an)\s+/i,
  /new\s+system\s+prompt/i,
  /\[SYSTEM\]/i,
  /\[INST\]/i,
  /<\|system\|>/i,
  /jailbreak/i,
  /DAN\s+mode/i,
  /developer\s+mode/i,
];

// Patterns for clearly harmful intent (block entirely)
const BLOCK_PATTERNS: RegExp[] = [
  /how\s+to\s+(make|build|create)\s+(bomb|weapon|malware|virus)/i,
  /generate\s+(malware|ransomware|exploit)/i,
];

const MAX_QUERY_LENGTH = 1000;

// Normalize unicode tricks to prevent injection bypass
function normalizeForSafety(text: string): string {
  return text
    .normalize("NFKD")                       // Decompose unicode
    .replace(/[\u200B-\u200F\uFEFF]/g, "")   // Strip zero-width chars
    .replace(/[\u0300-\u036f]/g, "");          // Strip combining diacritics
}

export function checkInput(rawQuery: string): InputGuardResult {
  // Normalize unicode tricks before checking patterns
  const normalized = normalizeForSafety(rawQuery);

  // Length check
  if (normalized.length > MAX_QUERY_LENGTH) {
    return {
      safe: false,
      reason: "Query exceeds maximum length",
      sanitized: rawQuery.slice(0, MAX_QUERY_LENGTH),
    };
  }

  // Hard block
  for (const pattern of BLOCK_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        safe: false,
        reason: "Query matches blocked content pattern",
        sanitized: "",
      };
    }
  }

  // Injection detection
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        safe: false,
        reason: `Potential prompt injection detected`,
        sanitized: "",
      };
    }
  }

  // Basic sanitization: strip XML/HTML tags to prevent tag injection
  const sanitized = rawQuery
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s.,!?;:()\-'"àáâãèéêìíòóôõùúăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return { safe: true, sanitized };
}
