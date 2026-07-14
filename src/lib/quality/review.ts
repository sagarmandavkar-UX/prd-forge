import { createId, nowIso } from "@/lib/utils/id";
import type {
  PrdDocument,
  QualityIssue,
  QualityReview,
  Requirement,
  UserStory
} from "@/types/prd";

const VAGUE_WORDS = [
  "fast",
  "easy",
  "simple",
  "intuitive",
  "user-friendly",
  "scalable"
];

function issue(
  sectionKey: string,
  title: string,
  description: string,
  rule: string,
  severity: QualityIssue["severity"] = "warning"
): QualityIssue {
  return {
    id: createId("issue"),
    sectionKey,
    title,
    description,
    rule,
    severity
  };
}

export function findDuplicateRequirements(
  requirements: Requirement[]
): Requirement[][] {
  const groups = new Map<string, Requirement[]>();
  requirements.forEach((requirement) => {
    const key = requirement.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    groups.set(key, [...(groups.get(key) ?? []), requirement]);
  });

  return [...groups.values()].filter((group) => group.length > 1);
}

export function reviewDocument(
  prd: PrdDocument | undefined,
  requirements: Requirement[],
  userStories: UserStory[]
): QualityReview {
  const issues: QualityIssue[] = [];
  const sectionText =
    prd?.sections
      .map((section) => `${section.title}\n${section.contentText}`)
      .join("\n") ?? "";
  const sectionByTitle = new Map(
    prd?.sections.map((section) => [section.title, section.sectionKey]) ?? []
  );

  if (!sectionText.toLowerCase().includes("privacy")) {
    issues.push(
      issue(
        "security-and-privacy-considerations",
        "Missing privacy consideration",
        "Add privacy handling, retention, and data access expectations.",
        "missing_privacy"
      )
    );
  }

  if (!sectionText.toLowerCase().includes("security")) {
    issues.push(
      issue(
        "security-and-privacy-considerations",
        "Missing security consideration",
        "Add authentication, authorization, and data protection expectations.",
        "missing_security"
      )
    );
  }

  if (!sectionText.toLowerCase().includes("accessibility")) {
    issues.push(
      issue(
        "accessibility-requirements",
        "Missing accessibility requirement",
        "Add accessibility standards and validation expectations.",
        "missing_accessibility"
      )
    );
  }

  VAGUE_WORDS.forEach((word) => {
    const pattern = new RegExp(`\\b${word}\\b`, "i");
    if (pattern.test(sectionText)) {
      issues.push(
        issue(
          "quality-review",
          `Unmeasurable word: ${word}`,
          `Replace "${word}" with a measurable threshold or observable behavior.`,
          "vague_language",
          "suggestion"
        )
      );
    }
  });

  requirements.forEach((requirement) => {
    if (requirement.acceptanceCriteria.length === 0) {
      issues.push(
        issue(
          "functional-requirements",
          `${requirement.requirementCode} has no acceptance criteria`,
          "Add Given/When/Then or equivalent testable criteria.",
          "missing_acceptance_criteria",
          "critical"
        )
      );
    }

    if (!requirement.relatedGoal) {
      issues.push(
        issue(
          "goals",
          `${requirement.requirementCode} is not linked to a goal`,
          "Connect the requirement to a product goal.",
          "requirement_missing_goal"
        )
      );
    }

    VAGUE_WORDS.forEach((word) => {
      if (new RegExp(`\\b${word}\\b`, "i").test(requirement.description)) {
        issues.push(
          issue(
            "functional-requirements",
            `${requirement.requirementCode} uses vague language`,
            `Replace "${word}" with a measurable condition.`,
            "requirement_vague_language"
          )
        );
      }
    });
  });

  userStories.forEach((story) => {
    if (!story.userValue || !story.story.toLowerCase().includes("so that")) {
      issues.push(
        issue(
          "user-stories",
          `${story.storyCode} is missing user value`,
          "Use the As a/I want/so that format or add clear user value.",
          "story_missing_value"
        )
      );
    }
  });

  findDuplicateRequirements(requirements).forEach((group) => {
    issues.push(
      issue(
        "functional-requirements",
        "Duplicate requirements detected",
        group.map((item) => item.requirementCode).join(", "),
        "duplicate_requirements"
      )
    );
  });

  const openQuestions = prd?.sections.find(
    (section) => section.title === "Open questions"
  );
  if (openQuestions?.contentText.toLowerCase().includes("launch")) {
    issues.push(
      issue(
        openQuestions.sectionKey,
        "Open question may block launch",
        "Resolve launch-blocking questions or mark an owner and decision date.",
        "launch_blocked",
        "critical"
      )
    );
  }

  const penalty = issues.reduce(
    (total, item) =>
      total +
      (item.severity === "critical" ? 9 : item.severity === "warning" ? 5 : 2),
    0
  );
  const overallScore = Math.max(0, Math.min(100, 96 - penalty));

  const categoryScores = {
    "Problem clarity": scoreFor(
      sectionByTitle.get("Problem statement"),
      issues,
      88
    ),
    "User understanding": scoreFor(
      sectionByTitle.get("Target users"),
      issues,
      84
    ),
    "Goal quality": scoreFor(sectionByTitle.get("Goals"), issues, 82),
    "Scope clarity": scoreFor(sectionByTitle.get("Non-goals"), issues, 80),
    "Requirement completeness": requirements.length
      ? Math.max(52, 90 - issues.length * 4)
      : 50,
    "Requirement testability": requirements.every(
      (requirement) => requirement.acceptanceCriteria.length > 0
    )
      ? 86
      : 58,
    "Metric quality": scoreFor(
      sectionByTitle.get("Success metrics"),
      issues,
      76
    ),
    "Risk coverage": scoreFor(
      sectionByTitle.get("Risks and mitigations"),
      issues,
      82
    ),
    "Technical feasibility": scoreFor(
      sectionByTitle.get("Constraints"),
      issues,
      78
    ),
    "Launch readiness": scoreFor(
      sectionByTitle.get("Launch readiness checklist"),
      issues,
      74
    )
  };

  return {
    id: createId("review"),
    prdId: prd?.id ?? "missing-prd",
    overallScore,
    categoryScores,
    issues,
    recommendations: issues.slice(0, 4).map((item) => item.title),
    strongSections: [
      "Problem statement",
      "Security and privacy considerations"
    ].filter((title) => sectionByTitle.has(title)),
    weakSections: issues.slice(0, 3).map((item) => item.sectionKey),
    createdAt: nowIso()
  };
}

function scoreFor(
  sectionKey: string | undefined,
  issues: QualityIssue[],
  base: number
): number {
  if (!sectionKey) return 45;
  const hits = issues.filter((item) => item.sectionKey === sectionKey).length;
  return Math.max(35, base - hits * 12);
}
