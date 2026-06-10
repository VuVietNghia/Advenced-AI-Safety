export function extractJsonObject<T>(raw: string | null): T | null {
  if (!raw) {
    return null;
  }

  const withoutFence = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  const direct = tryParse<T>(withoutFence);
  if (direct) {
    return direct;
  }

  const firstBrace = withoutFence.indexOf("{");
  const lastBrace = withoutFence.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return tryParse<T>(withoutFence.slice(firstBrace, lastBrace + 1));
  }

  return null;
}

function tryParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
