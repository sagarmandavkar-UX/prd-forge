import { describe, expect, it } from "vitest";

import { reviewDocument } from "@/lib/quality/review";
import { createInitialDemoState } from "@/lib/store/seed";

describe("quality review", () => {
  it("scores a seeded PRD and reports actionable issues", () => {
    const state = createInitialDemoState();
    const review = reviewDocument(
      state.prds.project_campus,
      state.requirements.project_campus,
      state.userStories.project_campus
    );
    expect(review.overallScore).toBeGreaterThan(60);
    expect(review.categoryScores["Requirement testability"]).toBeGreaterThan(
      60
    );
  });

  it("flags missing acceptance criteria", () => {
    const state = createInitialDemoState();
    const requirement = {
      ...state.requirements.project_campus[0],
      acceptanceCriteria: []
    };
    const review = reviewDocument(state.prds.project_campus, [requirement], []);
    expect(
      review.issues.some(
        (issue) => issue.rule === "missing_acceptance_criteria"
      )
    ).toBe(true);
  });
});
