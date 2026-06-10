export function sanitizeInput(input: string): string {
  if (!input) return '';

  // 1. Trim whitespace
  let sanitized = input.trim();

  // 2. Limit length (e.g. 2000 chars to prevent long context attacks)
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000);
  }

  // 3. Strip null bytes and non-printable characters
  // \x00-\x08, \x0B-\x0C, \x0E-\x1F, \x7F
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  return sanitized;
}
