import { describe, expect, it } from "vitest";

import {
  formatMarkdown,
  formatRequirementsCsv
} from "@/lib/exports/formatters";
import { createInitialDemoState } from "@/lib/store/seed";

describe("export formatting", () => {
  it("formats markdown with title and sections", () => {
    const state = createInitialDemoState();
    const markdown = formatMarkdown(
      state.prds.project_campus,
      state.requirements.project_campus,
      state.userStories.project_campus
    );
    expect(markdown).toContain("# Campus Club Application Hub PRD");
    expect(markdown).toContain("## Requirements");
  });

  it("formats requirements CSV", () => {
    const state = createInitialDemoState();
    const csv = formatRequirementsCsv(state.requirements.project_campus);
    expect(csv).toContain('"FR-001"');
    expect(csv.split("\n")[0]).toContain("Acceptance Criteria");
  });
});
