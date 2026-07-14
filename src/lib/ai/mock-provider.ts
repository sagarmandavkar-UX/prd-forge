import { PRD_SECTION_TITLES, sectionKey } from "@/lib/ai/sections";
import { reviewDocument } from "@/lib/quality/review";
import { createId, nowIso } from "@/lib/utils/id";
import type { AiContext, AiProvider } from "@/lib/ai/provider";
import type {
  DiscoveryQuestion,
  FunctionalRequirement,
  NonFunctionalRequirement,
  PrdDocument,
  PrdSection
} from "@/types/prd";

function lines(value: string): string[] {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function projectLabel(context: AiContext) {
  return context.input.basics.productName || context.project.name;
}

function makeSection(
  context: AiContext,
  prdId: string,
  title: string,
  position: number
): PrdSection {
  const product = projectLabel(context);
  const problem =
    context.input.users.userProblem || context.project.description;
  const goals = lines(context.input.strategy.productGoals).slice(0, 3);
  const mustHave = lines(context.input.scope.mustHave).slice(0, 5);
  const assumptions = [
    "Assumption: final launch metrics will be confirmed with the product team.",
    "Assumption: the first release uses existing authentication and analytics infrastructure."
  ];

  const contentByTitle: Record<string, string> = {
    "Document metadata": `Product: ${product}\nOwner: Demo Product Team\nStatus: Draft\nLast updated: ${new Date().toLocaleDateString()}`,
    "Executive summary": `${product} helps ${context.input.users.primaryUser || "target users"} solve a clearly scoped product problem: ${problem}. The first release focuses on the highest-confidence capabilities while marking assumptions and launch blockers for review.`,
    "Background and context": `${context.input.basics.detailedDescription}\n\nContext notes: ${context.input.context.researchNotes || "No external research claims are included. User-provided notes are treated as untrusted context and require validation."}`,
    "Problem statement": problem,
    "Product vision": `${product} should become the trusted workspace for ${context.input.users.primaryUser || "the primary user"} to complete the job with less ambiguity and better feedback loops.`,
    "Product principles":
      "1. Make uncertainty visible.\n2. Prefer measurable requirements over vague intent.\n3. Keep review workflows lightweight.\n4. Protect private project context by default.",
    "Target users": `${context.input.users.primaryUser}\n${context.input.users.secondaryUsers}`,
    "User personas": `Primary persona: ${context.input.users.primaryUser || "Product team member"}\nNeeds: clarity, speed, reviewability, and a way to turn context into decisions.`,
    "Jobs to be done":
      context.input.users.jobsToBeDone ||
      "When planning a product change, users need to move from rough context to clear requirements without losing assumptions.",
    "User needs":
      "Users need guided intake, focused discovery questions, editable sections, linked requirements, and export/share workflows.",
    Goals: goals.length
      ? goals.map((goal, index) => `${index + 1}. ${goal}`).join("\n")
      : context.input.strategy.productGoals,
    "Non-goals":
      context.input.scope.nonGoals ||
      "The first release will not scrape arbitrary URLs or invent research findings.",
    Assumptions: assumptions.join("\n"),
    "User stories":
      "As a product lead, I want a guided PRD workflow, so that I can produce a review-ready document faster.\nAs an engineer, I want testable acceptance criteria, so that implementation can begin with fewer gaps.",
    "Use cases":
      "1. Create a PRD from a rough product idea.\n2. Answer AI-generated discovery questions.\n3. Review and improve sections.\n4. Export or share a read-only version.",
    "Functional requirements": mustHave
      .map((item, index) => `FR-${String(index + 1).padStart(3, "0")}: ${item}`)
      .join("\n"),
    "Non-functional requirements":
      "NFR-001: The application must preserve private project content by default.\nNFR-002: Demo mode must work without external credentials.\nNFR-003: Export generation must avoid exposing secrets.",
    "User experience requirements":
      "The experience must provide visible progress, autosave state, accessible forms, keyboard navigation, and clear error recovery.",
    "Primary user flow":
      "Landing page -> demo/sign in -> create project -> intake -> discovery -> generate PRD -> edit sections -> review quality -> export/share.",
    "Edge cases":
      "Missing project context, skipped discovery answers, invalid AI response, expired share link, upload too large, and unsaved edits during navigation.",
    "Accessibility requirements":
      "WCAG 2.1 AA target, semantic landmarks, visible focus states, labeled controls, accessible dialogs, and no keyboard traps.",
    "Data and analytics requirements":
      "Track product events without collecting document content. Store only event names, timestamps, and non-sensitive metadata.",
    "Success metrics":
      context.input.strategy.successMetrics ||
      "Activation rate, completed PRDs, section quality score improvement, export completion rate.",
    "Guardrail metrics":
      "Export failure rate, unresolved critical quality issues, time to first PRD, and share link revocation rate.",
    Dependencies:
      context.input.scope.dependencies ||
      "Supabase configuration for production persistence; AI provider key for non-mock generation.",
    Constraints:
      context.input.scope.constraints ||
      "Demo mode must not mix with production user data. Uploaded files are limited to text or Markdown.",
    "Risks and mitigations": `${context.input.scope.risks || "Risk: AI output may include weak assumptions."}\nMitigation: validate structured JSON, mark assumptions, and provide rule-based quality checks.`,
    "Security and privacy considerations":
      "Private by default, server-side authorization, RLS policies, hashed share tokens, safe upload validation, and no secrets in browser logs.",
    "Rollout strategy":
      "Start with demo and internal pilot users, validate core PRD generation, then enable production Supabase and AI providers.",
    "Testing and validation plan":
      "Unit tests for schemas and utilities, component tests for key controls, Playwright tests for the demo workflow, and production build checks.",
    "Launch readiness checklist":
      "- Supabase migrations applied\n- Demo mode verified\n- Exports verified\n- Share links verified\n- Accessibility smoke test complete",
    "Open questions": context.questions
      .filter((question) => !question.answer && !question.skipped)
      .map((question) => `- ${question.question}`)
      .join("\n"),
    "Future considerations":
      "Template marketplace, reviewer comments, live collaborative editing, richer AI provider routing, and organization workspaces.",
    Appendix:
      "Source context includes intake answers, discovery responses, user-provided notes, and AI-generated assumptions."
  };

  return {
    id: createId("section"),
    prdId,
    sectionKey: sectionKey(title),
    title,
    contentText: contentByTitle[title] || "",
    contentJson: { type: "text", generatedBy: "mock" },
    position,
    isVisible: true,
    score: title.includes("Open") ? 70 : 82,
    updatedAt: nowIso()
  };
}

export const mockAiProvider: AiProvider = {
  name: "mock",
  async analyzeProductIdea(context) {
    return [
      `The strongest supplied problem is: ${context.input.users.userProblem}`,
      "The scope includes enough detail to create a first PRD draft.",
      "Metrics and launch readiness should be made more measurable before approval."
    ];
  },
  async generateDiscoveryQuestions(context) {
    const now = nowIso();
    const questions: Omit<
      DiscoveryQuestion,
      "id" | "position" | "createdAt" | "updatedAt"
    >[] = [
      {
        projectId: context.project.id,
        category: "User",
        question: `Which ${context.input.users.primaryUser || "primary users"} should be prioritized for the first release?`,
        rationale:
          "A sharper first persona keeps scope and requirements testable.",
        suggestedAnswers: [
          "Most frequent users",
          "Highest-risk users",
          "Internal pilot users"
        ],
        answer: "",
        skipped: false
      },
      {
        projectId: context.project.id,
        category: "Problem",
        question:
          "What evidence would convince the team that this problem is worth solving now?",
        rationale:
          "Evidence prevents the PRD from treating assumptions as facts.",
        suggestedAnswers: [
          "Interview pattern",
          "Support tickets",
          "Manual workaround volume"
        ],
        answer: "",
        skipped: false
      },
      {
        projectId: context.project.id,
        category: "Success",
        question:
          "What numeric target should define a successful first launch?",
        rationale:
          "A measurable launch target improves quality scoring and review readiness.",
        suggestedAnswers: [
          "Activation rate",
          "Task completion rate",
          "Time saved"
        ],
        answer: "",
        skipped: false
      },
      {
        projectId: context.project.id,
        category: "Scope",
        question: "Which capability is explicitly out of scope for v1?",
        rationale: "Non-goals help reviewers avoid accidental scope expansion.",
        suggestedAnswers: [
          "Admin automation",
          "External integrations",
          "Advanced reporting"
        ],
        answer: "",
        skipped: false
      },
      {
        projectId: context.project.id,
        category: "Risk",
        question:
          "What is the highest-impact risk if the requirement is misunderstood?",
        rationale:
          "Risk clarity helps the PRD include mitigation and validation plans.",
        suggestedAnswers: [
          "Privacy risk",
          "User adoption risk",
          "Delivery dependency"
        ],
        answer: "",
        skipped: false
      }
    ];

    return questions.map((question, index) => ({
      ...question,
      id: createId("question"),
      position: index,
      createdAt: now,
      updatedAt: now
    }));
  },
  async generatePRD(context) {
    const prdId = createId("prd");
    const now = nowIso();
    const sections = PRD_SECTION_TITLES.map((title, index) =>
      makeSection(context, prdId, title, index)
    );
    const prd: PrdDocument = {
      id: prdId,
      projectId: context.project.id,
      title: `${projectLabel(context)} PRD`,
      status: "draft",
      overallScore: 78,
      aiProvider: "mock",
      aiModel: "deterministic-demo",
      schemaVersion: "1.0.0",
      assumptions: [
        "Launch target values require confirmation from the product owner.",
        "Uploaded context has not been independently verified."
      ],
      openQuestions:
        sections
          .find((section) => section.title === "Open questions")
          ?.contentText.split("\n")
          .filter(Boolean) ?? [],
      sections,
      createdAt: now,
      updatedAt: now
    };
    return prd;
  },
  async regenerateSection(context, section) {
    return {
      ...makeSection(context, section.prdId, section.title, section.position),
      id: section.id,
      previousContent: section.contentText
    };
  },
  async improveSection(_context, section, action) {
    const suffix =
      action === "Add measurable outcomes"
        ? "\n\nMeasurable outcome: define a baseline, target, and validation method before approval."
        : `\n\nImprovement note: ${action} applied while preserving user edits for review.`;

    return `${section.contentText}${suffix}`;
  },
  async generateRequirements(context) {
    const now = nowIso();
    const prdId = context.prd?.id ?? createId("prd");
    const functional: FunctionalRequirement[] = lines(
      context.input.scope.mustHave
    )
      .slice(0, 4)
      .map((item, index) => ({
        id: createId("req"),
        projectId: context.project.id,
        prdId,
        requirementCode: `FR-${String(index + 1).padStart(3, "0")}`,
        requirementType: "functional",
        category: "Core workflow",
        title: item.length > 56 ? `${item.slice(0, 53)}...` : item,
        description: item,
        rationale: "This capability is listed as must-have intake scope.",
        priority: index < 2 ? "Must have" : "Should have",
        status: index === 0 ? "Approved" : "Draft",
        relatedGoal:
          context.input.strategy.productGoals.split("\n")[0] ||
          "Primary product goal",
        relatedPersona: context.input.users.primaryUser || "Primary user",
        acceptanceCriteria: [
          "Given the user has access, when they complete the flow, then the requirement outcome is visible.",
          "Given invalid input, when the user submits, then a clear error explains how to recover."
        ],
        dependencies: [],
        createdAt: now,
        updatedAt: now
      }));

    const nonFunctional: NonFunctionalRequirement[] = [
      {
        id: createId("req"),
        projectId: context.project.id,
        prdId,
        requirementCode: "NFR-001",
        requirementType: "non-functional",
        category: "Accessibility",
        title: "Keyboard accessible core workflow",
        description:
          "All core project, PRD, requirements, export, and sharing controls must be keyboard accessible.",
        rationale:
          "The product targets WCAG 2.1 AA and repeated document workflows.",
        priority: "Must have",
        status: "Ready for review",
        measurement: "100% of core controls reachable with keyboard",
        validationMethod:
          "Manual keyboard pass and automated accessibility smoke tests",
        relatedGoal: "Launch readiness",
        relatedPersona: "Product team member",
        acceptanceCriteria: [
          "Given keyboard-only use, when navigating core routes, then no action is blocked."
        ],
        dependencies: [],
        createdAt: now,
        updatedAt: now
      }
    ];

    return [...functional, ...nonFunctional];
  },
  async generateUserStories(context) {
    const now = nowIso();
    const prdId = context.prd?.id ?? createId("prd");
    return [
      {
        id: createId("story"),
        projectId: context.project.id,
        prdId,
        storyCode: "US-001",
        persona: context.input.users.primaryUser || "Product manager",
        story:
          "As a product manager, I want guided PRD generation, so that I can turn rough context into a reviewable document.",
        userValue: "Faster path from idea to aligned requirements.",
        priority: "Must have",
        status: "Ready for review",
        acceptanceCriteria: [
          "Given completed intake, when I generate a PRD, then validated sections are created."
        ],
        relatedRequirementIds: [],
        createdAt: now,
        updatedAt: now
      }
    ];
  },
  async reviewPRDQuality(context) {
    return reviewDocument(
      context.prd,
      context.requirements ?? [],
      context.userStories ?? []
    );
  },
  async detectContradictions(context) {
    const nonGoals = context.input.scope.nonGoals.toLowerCase();
    return (context.requirements ?? [])
      .filter(
        (requirement) =>
          nonGoals && nonGoals.includes(requirement.title.toLowerCase())
      )
      .map(
        (requirement) =>
          `${requirement.requirementCode} may conflict with a non-goal.`
      );
  },
  async generateExecutiveSummary(context) {
    return `${projectLabel(context)} addresses ${context.input.users.userProblem}. The PRD prioritizes measurable launch goals, explicit assumptions, and scoped requirements.`;
  }
};
