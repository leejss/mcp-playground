export function safeParseJson(text: string) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('Invalid JSON format', { cause: text });
  }
}
