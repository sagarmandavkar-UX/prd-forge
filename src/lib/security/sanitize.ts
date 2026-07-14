const UNSAFE_TAGS = /<\/?(script|iframe|object|embed|style)[^>]*>/gi;
const UNSAFE_ATTRS = /\s(on\w+|style)=["'][^"']*["']/gi;

export function sanitizeText(input: string, maxLength = 20_000): string {
  return input
    .replace(UNSAFE_TAGS, "")
    .replace(UNSAFE_ATTRS, "")
    .slice(0, maxLength)
    .trim();
}

export function isAllowedUpload(fileName: string, sizeBytes: number): boolean {
  const lower = fileName.toLowerCase();
  const allowedType =
    lower.endsWith(".txt") ||
    lower.endsWith(".md") ||
    lower.endsWith(".markdown");
  return allowedType && sizeBytes <= 5 * 1024 * 1024;
}
