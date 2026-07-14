import type {
  DiscoveryQuestion,
  PrdDocument,
  PrdSection,
  Project,
  ProjectInput,
  QualityReview,
  Requirement,
  UserStory
} from "@/types/prd";

export interface AiContext {
  project: Project;
  input: ProjectInput;
  questions: DiscoveryQuestion[];
  prd?: PrdDocument;
  requirements?: Requirement[];
  userStories?: UserStory[];
}

export interface AiProvider {
  name: "mock" | "openai" | "gemini";
  analyzeProductIdea(context: AiContext): Promise<string[]>;
  generateDiscoveryQuestions(context: AiContext): Promise<DiscoveryQuestion[]>;
  generatePRD(context: AiContext): Promise<PrdDocument>;
  regenerateSection(
    context: AiContext,
    section: PrdSection
  ): Promise<PrdSection>;
  improveSection(
    context: AiContext,
    section: PrdSection,
    action: string
  ): Promise<string>;
  generateRequirements(context: AiContext): Promise<Requirement[]>;
  generateUserStories(context: AiContext): Promise<UserStory[]>;
  reviewPRDQuality(context: AiContext): Promise<QualityReview>;
  detectContradictions(context: AiContext): Promise<string[]>;
  generateExecutiveSummary(context: AiContext): Promise<string>;
}

export class AiProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiProviderError";
  }
}
