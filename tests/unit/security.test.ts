import { describe, expect, it } from "vitest";

import { sanitizeText, isAllowedUpload } from "@/lib/security/sanitize";
import { createShareToken, hashToken } from "@/lib/security/tokens";

describe("security utilities", () => {
  it("sanitizes unsafe pasted content", () => {
    expect(
      sanitizeText('<script>alert("x")</script><p onclick="bad()">Safe</p>')
    ).not.toContain("script");
  });

  it("validates upload type and size", () => {
    expect(isAllowedUpload("notes.md", 1024)).toBe(true);
    expect(isAllowedUpload("notes.pdf", 1024)).toBe(false);
    expect(isAllowedUpload("notes.md", 6 * 1024 * 1024)).toBe(false);
  });

  it("creates and hashes unguessable share tokens", () => {
    const token = createShareToken();
    expect(token.length).toBeGreaterThan(20);
    expect(hashToken(token)).toHaveLength(64);
  });
});
