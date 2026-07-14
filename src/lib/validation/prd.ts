import { z } from "zod";

export const prioritySchema = z.enum([
  "Must have",
  "Should have",
  "Could have",
  "Won't have now"
]);
export const statusSchema = z.enum([
  "Draft",
  "Ready for review",
  "Approved",
  "In development",
  "Completed",
  "Deferred"
]);

export const projectInputSchema = z.object({
  basics: z.object({
    productName: z.string().min(2, "Add a product name."),
    oneSentenceIdea: z
      .string()
      .min(12, "Summarize the idea in one useful sentence."),
    detailedDescription: z.string().min(30, "Add enough context for the PRD."),
    productType: z.string().min(2),
    platform: z.string().min(2),
    productStage: z.string().min(2),
    industry: z.string().min(2),
    teamSize: z.string().min(1)
  }),
  users: z.object({
    primaryUser: z.string().min(3),
    secondaryUsers: z.string(),
    userProblem: z.string().min(20),
    currentAlternatives: z.string(),
    evidence: z.string(),
    userContext: z.string(),
    jobsToBeDone: z.string()
  }),
  strategy: z.object({
    businessObjective: z.string().min(5),
    userOutcome: z.string().min(5),
    productGoals: z.string().min(5),
    successMetrics: z.string().min(5),
    strategicAlignment: z.string(),
    launchWindow: z.string()
  }),
  scope: z.object({
    mustHave: z.string().min(5),
    niceToHave: z.string(),
    nonGoals: z.string(),
    constraints: z.string(),
    dependencies: z.string(),
    risks: z.string(),
    technicalConsiderations: z.string()
  }),
  context: z.object({
    researchNotes: z.string(),
    meetingNotes: z.string(),
    customerFindings: z.string(),
    competitorNotes: z.string(),
    referenceLinks: z.string(),
    uploadedFileName: z.string().optional(),
    uploadedText: z.string().optional(),
    templateKey: z.string().min(2)
  })
});

export const discoveryQuestionSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  category: z.enum([
    "User",
    "Problem",
    "Value",
    "Scope",
    "Success",
    "Risk",
    "Technical feasibility",
    "Launch"
  ]),
  question: z.string().min(10),
  rationale: z.string().min(10),
  suggestedAnswers: z.array(z.string()).max(4),
  answer: z.string(),
  skipped: z.boolean(),
  position: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const requirementSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  prdId: z.string(),
  requirementCode: z.string().regex(/^(FR|NFR)-\d{3}$/),
  requirementType: z.enum(["functional", "non-functional"]),
  category: z.string().min(2),
  title: z.string().min(3),
  description: z.string().min(10),
  rationale: z.string().min(10),
  priority: prioritySchema,
  status: statusSchema,
  measurement: z.string().optional(),
  validationMethod: z.string().optional(),
  relatedGoal: z.string(),
  relatedPersona: z.string(),
  acceptanceCriteria: z.array(z.string()).min(1),
  dependencies: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const userStorySchema = z.object({
  id: z.string(),
  projectId: z.string(),
  prdId: z.string(),
  storyCode: z.string().regex(/^US-\d{3}$/),
  persona: z.string().min(2),
  story: z.string().min(10),
  userValue: z.string().min(3),
  priority: prioritySchema,
  status: statusSchema,
  acceptanceCriteria: z.array(z.string()).min(1),
  relatedRequirementIds: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const prdSectionSchema = z.object({
  id: z.string(),
  prdId: z.string(),
  sectionKey: z.string().min(2),
  title: z.string().min(2),
  contentText: z.string(),
  contentJson: z.record(z.unknown()),
  position: z.number().int().nonnegative(),
  isVisible: z.boolean(),
  score: z.number().min(0).max(100),
  updatedAt: z.string(),
  previousContent: z.string().optional()
});

export const prdDocumentSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string().min(3),
  status: z.enum(["draft", "ready", "approved"]),
  overallScore: z.number().min(0).max(100),
  aiProvider: z.enum(["mock", "openai", "gemini"]),
  aiModel: z.string(),
  schemaVersion: z.string(),
  assumptions: z.array(z.string()),
  openQuestions: z.array(z.string()),
  sections: z.array(prdSectionSchema).min(8),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const qualityIssueSchema = z.object({
  id: z.string(),
  severity: z.enum(["critical", "warning", "suggestion"]),
  sectionKey: z.string(),
  title: z.string(),
  description: z.string(),
  rule: z.string()
});

export const qualityReviewSchema = z.object({
  id: z.string(),
  prdId: z.string(),
  overallScore: z.number().min(0).max(100),
  categoryScores: z.record(z.number().min(0).max(100)),
  issues: z.array(qualityIssueSchema),
  recommendations: z.array(z.string()),
  strongSections: z.array(z.string()),
  weakSections: z.array(z.string()),
  createdAt: z.string()
});

export type ProjectInputForm = z.infer<typeof projectInputSchema>;
