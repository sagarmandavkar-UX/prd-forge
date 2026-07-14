import { describe, expect, it } from "vitest";

import { mockAiProvider } from "@/lib/ai/mock-provider";
import { createInitialDemoState } from "@/lib/store/seed";

describe("mock AI provider", () => {
  it("generates schema-shaped discovery questions and PRDs", async () => {
    const state = createInitialDemoState();
    const project = state.projects[0];
    const context = {
      project,
      input: state.inputs[project.id],
      questions: state.discoveryQuestions[project.id],
      requirements: state.requirements[project.id],
      userStories: state.userStories[project.id]
    };
    const questions = await mockAiProvider.generateDiscoveryQuestions(context);
    const prd = await mockAiProvider.generatePRD({ ...context, questions });
    expect(questions.length).toBeGreaterThanOrEqual(5);
    expect(prd.sections.length).toBeGreaterThan(20);
    expect(prd.assumptions[0]).toContain("Launch");
  });
});
