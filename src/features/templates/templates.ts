import type { TemplateDefinition } from "@/types/prd";

export const templates: TemplateDefinition[] = [
  {
    key: "new-product",
    name: "New product",
    description:
      "Full PRD for a product from early concept through launch readiness.",
    recommendedSections: [
      "Problem statement",
      "Product vision",
      "Target users",
      "Functional requirements",
      "Rollout strategy"
    ],
    exampleRequirements: [
      "Create guided onboarding",
      "Track activation event",
      "Export launch checklist"
    ],
    qualityRules: [
      "Require measurable launch metric",
      "Require explicit non-goals"
    ]
  },
  {
    key: "feature-launch",
    name: "Feature launch",
    description: "Focused PRD for extending an existing product surface.",
    recommendedSections: [
      "Background and context",
      "User needs",
      "Functional requirements",
      "Success metrics"
    ],
    exampleRequirements: [
      "Expose feature flag",
      "Track feature adoption",
      "Add rollback plan"
    ],
    qualityRules: ["Require dependency map", "Require guardrail metric"]
  },
  {
    key: "internal-tool",
    name: "Internal tool",
    description: "Operational workflow PRD for teams and back-office users.",
    recommendedSections: [
      "Target users",
      "Primary user flow",
      "Data and analytics requirements",
      "Security and privacy considerations"
    ],
    exampleRequirements: [
      "Role-based dashboard",
      "Bulk edit workflow",
      "Audit log"
    ],
    qualityRules: ["Require role permissions", "Require audit trail"]
  },
  {
    key: "mobile-app",
    name: "Mobile application",
    description:
      "Mobile-first PRD with accessibility, offline, and platform constraints.",
    recommendedSections: [
      "User experience requirements",
      "Accessibility requirements",
      "Non-functional requirements"
    ],
    exampleRequirements: [
      "Responsive mobile navigation",
      "Offline error recovery",
      "Push notification consent"
    ],
    qualityRules: [
      "Require platform support",
      "Require accessibility validation"
    ]
  },
  {
    key: "ai-ml-feature",
    name: "AI or machine-learning feature",
    description:
      "PRD for AI-assisted workflows with assumptions, safety, and evaluation criteria.",
    recommendedSections: [
      "Assumptions",
      "Risks and mitigations",
      "Testing and validation plan",
      "Security and privacy considerations"
    ],
    exampleRequirements: [
      "Show model uncertainty",
      "Allow human review",
      "Log prompt metadata without content"
    ],
    qualityRules: ["Require safety note", "Require evaluation dataset plan"]
  },
  {
    key: "api-product",
    name: "API product",
    description:
      "Developer-facing PRD for APIs, contracts, rate limits, and documentation.",
    recommendedSections: [
      "Functional requirements",
      "Non-functional requirements",
      "Security and privacy considerations",
      "Appendix"
    ],
    exampleRequirements: [
      "Create API key flow",
      "Publish OpenAPI spec",
      "Return structured errors"
    ],
    qualityRules: ["Require authentication model", "Require versioning plan"]
  },
  {
    key: "experiment",
    name: "Experiment",
    description:
      "PRD for validating a hypothesis with success and guardrail metrics.",
    recommendedSections: [
      "Goals",
      "Success metrics",
      "Guardrail metrics",
      "Testing and validation plan"
    ],
    exampleRequirements: [
      "Define treatment cohort",
      "Track conversion",
      "Stop experiment on guardrail breach"
    ],
    qualityRules: ["Require hypothesis", "Require minimum detectable effect"]
  },
  {
    key: "platform-migration",
    name: "Platform migration",
    description:
      "PRD for a migration that balances user continuity and technical risk.",
    recommendedSections: [
      "Dependencies",
      "Constraints",
      "Risks and mitigations",
      "Rollout strategy"
    ],
    exampleRequirements: [
      "Run parallel migration",
      "Backfill data",
      "Create rollback path"
    ],
    qualityRules: ["Require rollback plan", "Require data validation"]
  },
  {
    key: "student-project",
    name: "Student project",
    description:
      "Lightweight PRD for academic teams with clear assumptions and scope.",
    recommendedSections: [
      "Problem statement",
      "Target users",
      "Use cases",
      "Future considerations"
    ],
    exampleRequirements: [
      "Create prototype flow",
      "Collect feedback",
      "Prepare presentation export"
    ],
    qualityRules: ["Require learning objective", "Require feasible v1 scope"]
  }
];
