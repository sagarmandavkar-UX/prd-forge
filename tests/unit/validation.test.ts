import { describe, expect, it } from "vitest";

import { prdDocumentSchema, requirementSchema } from "@/lib/validation/prd";
import { createInitialDemoState } from "@/lib/store/seed";

describe("validation schemas", () => {
  it("accepts the seeded PRD document", () => {
    const state = createInitialDemoState();
    expect(() =>
      prdDocumentSchema.parse(state.prds.project_campus)
    ).not.toThrow();
  });

  it("requires requirement IDs to use FR or NFR format", () => {
    const state = createInitialDemoState();
    const requirement = state.requirements.project_campus[0];
    expect(() => requirementSchema.parse(requirement)).not.toThrow();
    expect(() =>
      requirementSchema.parse({ ...requirement, requirementCode: "REQ-1" })
    ).toThrow();
  });
});
