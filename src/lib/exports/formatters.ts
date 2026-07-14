import type { PrdDocument, Requirement, UserStory } from "@/types/prd";

export function formatMarkdown(
  prd: PrdDocument,
  requirements: Requirement[],
  stories: UserStory[]
): string {
  const sections = prd.sections
    .filter((section) => section.isVisible)
    .sort((a, b) => a.position - b.position)
    .map(
      (section, index) =>
        `## ${index + 1}. ${section.title}\n\n${section.contentText}`
    )
    .join("\n\n");

  return `# ${prd.title}

Generated date: ${new Date().toISOString()}
Last edited date: ${prd.updatedAt}
Quality score: ${prd.overallScore}/100

${sections}

## Requirements

${requirements
  .map(
    (requirement) =>
      `### ${requirement.requirementCode}: ${requirement.title}

- Type: ${requirement.requirementType}
- Priority: ${requirement.priority}
- Status: ${requirement.status}
- Related goal: ${requirement.relatedGoal || "Unlinked"}
- Related persona: ${requirement.relatedPersona || "Unlinked"}

${requirement.description}

Acceptance criteria:
${requirement.acceptanceCriteria.map((criterion) => `- ${criterion}`).join("\n")}`
  )
  .join("\n\n")}

## User Stories

${stories
  .map(
    (story) =>
      `### ${story.storyCode}

${story.story}

Value: ${story.userValue}
Acceptance criteria:
${story.acceptanceCriteria.map((criterion) => `- ${criterion}`).join("\n")}`
  )
  .join("\n\n")}
`;
}

export function formatPlainText(
  prd: PrdDocument,
  requirements: Requirement[],
  stories: UserStory[]
): string {
  return formatMarkdown(prd, requirements, stories)
    .replace(/^#+\s/gm, "")
    .replace(/^- /gm, " - ");
}

export function formatRequirementsCsv(requirements: Requirement[]): string {
  const rows = [
    [
      "ID",
      "Title",
      "Type",
      "Category",
      "Priority",
      "Status",
      "Related Goal",
      "Related Persona",
      "Acceptance Criteria"
    ],
    ...requirements.map((requirement) => [
      requirement.requirementCode,
      requirement.title,
      requirement.requirementType,
      requirement.category,
      requirement.priority,
      requirement.status,
      requirement.relatedGoal,
      requirement.relatedPersona,
      requirement.acceptanceCriteria.join(" | ")
    ])
  ];

  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export function buildExportFileName(title: string, extension: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug || "prd"}-${new Date().toISOString().slice(0, 10)}.${extension}`;
}
