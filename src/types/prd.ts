export type ProjectStatus = "draft" | "active" | "completed" | "archived";

export type RequirementPriority =
  "Must have" | "Should have" | "Could have" | "Won't have now";

export type RequirementStatus =
  | "Draft"
  | "Ready for review"
  | "Approved"
  | "In development"
  | "Completed"
  | "Deferred";

export type DiscoveryCategory =
  | "User"
  | "Problem"
  | "Value"
  | "Scope"
  | "Success"
  | "Risk"
  | "Technical feasibility"
  | "Launch";

export type RequirementType = "functional" | "non-functional";

export interface Profile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  basics: {
    productName: string;
    oneSentenceIdea: string;
    detailedDescription: string;
    productType: string;
    platform: string;
    productStage: string;
    industry: string;
    teamSize: string;
  };
  users: {
    primaryUser: string;
    secondaryUsers: string;
    userProblem: string;
    currentAlternatives: string;
    evidence: string;
    userContext: string;
    jobsToBeDone: string;
  };
  strategy: {
    businessObjective: string;
    userOutcome: string;
    productGoals: string;
    successMetrics: string;
    strategicAlignment: string;
    launchWindow: string;
  };
  scope: {
    mustHave: string;
    niceToHave: string;
    nonGoals: string;
    constraints: string;
    dependencies: string;
    risks: string;
    technicalConsiderations: string;
  };
  context: {
    researchNotes: string;
    meetingNotes: string;
    customerFindings: string;
    competitorNotes: string;
    referenceLinks: string;
    uploadedFileName?: string;
    uploadedText?: string;
    templateKey: string;
  };
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  productType: string;
  industry: string;
  platform: string;
  stage: string;
  status: ProjectStatus;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveryQuestion {
  id: string;
  projectId: string;
  category: DiscoveryCategory;
  question: string;
  rationale: string;
  suggestedAnswers: string[];
  answer: string;
  skipped: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface FunctionalRequirement {
  id: string;
  projectId: string;
  prdId: string;
  requirementCode: string;
  requirementType: "functional";
  category: string;
  title: string;
  description: string;
  rationale: string;
  priority: RequirementPriority;
  status: RequirementStatus;
  relatedGoal: string;
  relatedPersona: string;
  acceptanceCriteria: string[];
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NonFunctionalRequirement {
  id: string;
  projectId: string;
  prdId: string;
  requirementCode: string;
  requirementType: "non-functional";
  category:
    | "Performance"
    | "Reliability"
    | "Security"
    | "Privacy"
    | "Accessibility"
    | "Scalability"
    | "Compatibility"
    | "Observability"
    | "Maintainability";
  title: string;
  description: string;
  rationale: string;
  priority: RequirementPriority;
  status: RequirementStatus;
  measurement: string;
  validationMethod: string;
  acceptanceCriteria: string[];
  dependencies: string[];
  relatedGoal: string;
  relatedPersona: string;
  createdAt: string;
  updatedAt: string;
}

export type Requirement = FunctionalRequirement | NonFunctionalRequirement;

export interface UserStory {
  id: string;
  projectId: string;
  prdId: string;
  storyCode: string;
  persona: string;
  story: string;
  userValue: string;
  priority: RequirementPriority;
  status: RequirementStatus;
  acceptanceCriteria: string[];
  relatedRequirementIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PrdSection {
  id: string;
  prdId: string;
  sectionKey: string;
  title: string;
  contentText: string;
  contentJson: Record<string, unknown>;
  position: number;
  isVisible: boolean;
  score: number;
  updatedAt: string;
  previousContent?: string;
}

export interface PrdDocument {
  id: string;
  projectId: string;
  title: string;
  status: "draft" | "ready" | "approved";
  overallScore: number;
  aiProvider: "mock" | "openai" | "gemini";
  aiModel: string;
  schemaVersion: string;
  assumptions: string[];
  openQuestions: string[];
  sections: PrdSection[];
  createdAt: string;
  updatedAt: string;
}

export interface QualityIssue {
  id: string;
  severity: "critical" | "warning" | "suggestion";
  sectionKey: string;
  title: string;
  description: string;
  rule: string;
}

export interface QualityReview {
  id: string;
  prdId: string;
  overallScore: number;
  categoryScores: Record<string, number>;
  issues: QualityIssue[];
  recommendations: string[];
  strongSections: string[];
  weakSections: string[];
  createdAt: string;
}

export interface PrdVersion {
  id: string;
  prdId: string;
  versionNumber: number;
  versionName: string;
  snapshot: PrdDocument;
  changeNote: string;
  createdBy: string;
  createdAt: string;
}

export interface ShareLink {
  id: string;
  projectId: string;
  token: string;
  tokenHash: string;
  isActive: boolean;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface TemplateDefinition {
  key: string;
  name: string;
  description: string;
  recommendedSections: string[];
  exampleRequirements: string[];
  qualityRules: string[];
}

export interface DemoState {
  profile: Profile;
  projects: Project[];
  inputs: Record<string, ProjectInput>;
  discoveryQuestions: Record<string, DiscoveryQuestion[]>;
  prds: Record<string, PrdDocument>;
  requirements: Record<string, Requirement[]>;
  userStories: Record<string, UserStory[]>;
  reviews: Record<string, QualityReview>;
  versions: Record<string, PrdVersion[]>;
  shareLinks: ShareLink[];
  demoMode: boolean;
}
