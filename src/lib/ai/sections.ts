export const PRD_SECTION_TITLES = [
  "Document metadata",
  "Executive summary",
  "Background and context",
  "Problem statement",
  "Product vision",
  "Product principles",
  "Target users",
  "User personas",
  "Jobs to be done",
  "User needs",
  "Goals",
  "Non-goals",
  "Assumptions",
  "User stories",
  "Use cases",
  "Functional requirements",
  "Non-functional requirements",
  "User experience requirements",
  "Primary user flow",
  "Edge cases",
  "Accessibility requirements",
  "Data and analytics requirements",
  "Success metrics",
  "Guardrail metrics",
  "Dependencies",
  "Constraints",
  "Risks and mitigations",
  "Security and privacy considerations",
  "Rollout strategy",
  "Testing and validation plan",
  "Launch readiness checklist",
  "Open questions",
  "Future considerations",
  "Appendix"
] as const;

export function sectionKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
