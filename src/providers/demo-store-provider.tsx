"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { mockAiProvider } from "@/lib/ai/mock-provider";
import { reviewDocument } from "@/lib/quality/review";
import { createInitialDemoState, emptyInput } from "@/lib/store/seed";
import { createId, nowIso } from "@/lib/utils/id";
import type {
  DemoState,
  DiscoveryQuestion,
  PrdDocument,
  Project,
  ProjectInput,
  Requirement,
  RequirementStatus,
  RequirementPriority,
  ShareLink
} from "@/types/prd";

interface DemoStoreContextValue {
  state: DemoState;
  ready: boolean;
  enterDemoMode: () => void;
  resetDemo: () => void;
  updateProfile: (patch: { fullName?: string; role?: string }) => void;
  createProject: (input: ProjectInput) => Promise<Project>;
  updateProject: (projectId: string, patch: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  archiveProject: (projectId: string) => void;
  restoreProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => void;
  saveInput: (projectId: string, input: ProjectInput) => void;
  generateDiscovery: (projectId: string) => Promise<DiscoveryQuestion[]>;
  answerQuestion: (
    projectId: string,
    questionId: string,
    answer: string
  ) => void;
  skipQuestion: (projectId: string, questionId: string) => void;
  addQuestion: (projectId: string) => Promise<void>;
  generatePrd: (projectId: string) => Promise<PrdDocument>;
  updateSection: (
    projectId: string,
    sectionId: string,
    contentText: string
  ) => void;
  improveSection: (
    projectId: string,
    sectionId: string,
    action: string
  ) => Promise<string>;
  restoreSection: (projectId: string, sectionId: string) => void;
  hideSection: (projectId: string, sectionId: string) => void;
  showSection: (projectId: string, sectionId: string) => void;
  reorderSection: (
    projectId: string,
    sourceSectionId: string,
    targetSectionId: string
  ) => void;
  addCustomSection: (projectId: string, title: string) => void;
  addRequirement: (
    projectId: string,
    requirement?: Partial<Requirement>
  ) => void;
  updateRequirement: (
    projectId: string,
    requirementId: string,
    patch: Partial<Requirement>
  ) => void;
  deleteRequirement: (projectId: string, requirementId: string) => void;
  bulkUpdateRequirements: (
    projectId: string,
    requirementIds: string[],
    patch: { priority?: RequirementPriority; status?: RequirementStatus }
  ) => void;
  runQualityReview: (projectId: string) => void;
  createVersion: (
    projectId: string,
    versionName: string,
    changeNote: string
  ) => void;
  restoreVersion: (projectId: string, versionId: string) => void;
  createShareLink: (projectId: string, expiresAt?: string) => ShareLink;
  revokeShareLink: (shareLinkId: string) => void;
}

const DemoStoreContext = createContext<DemoStoreContextValue | null>(null);
const STORAGE_KEY = "prd-forge.demo-state";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function browserToken() {
  const bytes = new Uint8Array(18);
  if (typeof crypto !== "undefined") {
    crypto.getRandomValues(bytes);
  } else {
    bytes.forEach((_, index) => {
      bytes[index] = Math.floor(Math.random() * 256);
    });
  }
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function projectFromInput(input: ProjectInput): Project {
  const now = nowIso();
  return {
    id: createId("project"),
    ownerId: "demo_user",
    name: input.basics.productName,
    description: input.basics.oneSentenceIdea,
    productType: input.basics.productType,
    industry: input.basics.industry,
    platform: input.basics.platform,
    stage: input.basics.productStage,
    status: "draft",
    createdAt: now,
    updatedAt: now
  };
}

function contextFor(state: DemoState, projectId: string) {
  const project = state.projects.find((item) => item.id === projectId);
  if (!project) {
    throw new Error("Project not found.");
  }
  return {
    project,
    input: state.inputs[projectId] ?? emptyInput,
    questions: state.discoveryQuestions[projectId] ?? [],
    prd: state.prds[projectId],
    requirements: state.requirements[projectId] ?? [],
    userStories: state.userStories[projectId] ?? []
  };
}

export function DemoStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(() => {
    if (typeof window === "undefined") {
      return createInitialDemoState();
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored
      ? (JSON.parse(stored) as DemoState)
      : createInitialDemoState();
  });
  const ready = true;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<DemoStoreContextValue>(
    () => ({
      state,
      ready,
      enterDemoMode() {
        setState((current) => ({ ...current, demoMode: true }));
      },
      resetDemo() {
        setState(createInitialDemoState());
      },
      updateProfile(patch) {
        setState((current) => ({
          ...current,
          profile: { ...current.profile, ...patch, updatedAt: nowIso() }
        }));
      },
      async createProject(input) {
        const project = projectFromInput(input);
        const questions = await mockAiProvider.generateDiscoveryQuestions({
          project,
          input,
          questions: []
        });
        setState((current) => ({
          ...current,
          projects: [project, ...current.projects],
          inputs: { ...current.inputs, [project.id]: input },
          discoveryQuestions: {
            ...current.discoveryQuestions,
            [project.id]: questions
          },
          requirements: { ...current.requirements, [project.id]: [] },
          userStories: { ...current.userStories, [project.id]: [] },
          versions: { ...current.versions, [project.id]: [] }
        }));
        return project;
      },
      updateProject(projectId, patch) {
        setState((current) => ({
          ...current,
          projects: current.projects.map((project) =>
            project.id === projectId
              ? { ...project, ...patch, updatedAt: nowIso() }
              : project
          )
        }));
      },
      deleteProject(projectId) {
        setState((current) => ({
          ...current,
          projects: current.projects.filter(
            (project) => project.id !== projectId
          )
        }));
      },
      archiveProject(projectId) {
        setState((current) => ({
          ...current,
          projects: current.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  status: "archived",
                  archivedAt: nowIso(),
                  updatedAt: nowIso()
                }
              : project
          )
        }));
      },
      restoreProject(projectId) {
        setState((current) => ({
          ...current,
          projects: current.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  status: "active",
                  archivedAt: undefined,
                  updatedAt: nowIso()
                }
              : project
          )
        }));
      },
      duplicateProject(projectId) {
        setState((current) => {
          const original = current.projects.find(
            (project) => project.id === projectId
          );
          if (!original) return current;
          const id = createId("project");
          const copy = {
            ...original,
            id,
            name: `${original.name} Copy`,
            status: "draft" as const,
            createdAt: nowIso(),
            updatedAt: nowIso()
          };
          return {
            ...current,
            projects: [copy, ...current.projects],
            inputs: {
              ...current.inputs,
              [id]: clone(current.inputs[projectId])
            },
            discoveryQuestions: {
              ...current.discoveryQuestions,
              [id]: clone(current.discoveryQuestions[projectId] ?? [])
            },
            prds: current.prds[projectId]
              ? {
                  ...current.prds,
                  [id]: {
                    ...clone(current.prds[projectId]),
                    id: createId("prd"),
                    projectId: id
                  }
                }
              : current.prds,
            requirements: {
              ...current.requirements,
              [id]: clone(current.requirements[projectId] ?? [])
            },
            userStories: {
              ...current.userStories,
              [id]: clone(current.userStories[projectId] ?? [])
            },
            versions: { ...current.versions, [id]: [] }
          };
        });
      },
      saveInput(projectId, input) {
        setState((current) => ({
          ...current,
          inputs: { ...current.inputs, [projectId]: input },
          projects: current.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  name: input.basics.productName || project.name,
                  description:
                    input.basics.oneSentenceIdea || project.description,
                  productType: input.basics.productType,
                  industry: input.basics.industry,
                  platform: input.basics.platform,
                  stage: input.basics.productStage,
                  updatedAt: nowIso()
                }
              : project
          )
        }));
      },
      async generateDiscovery(projectId) {
        const context = contextFor(state, projectId);
        const questions =
          await mockAiProvider.generateDiscoveryQuestions(context);
        setState((current) => ({
          ...current,
          discoveryQuestions: {
            ...current.discoveryQuestions,
            [projectId]: questions
          }
        }));
        return questions;
      },
      answerQuestion(projectId, questionId, answer) {
        setState((current) => ({
          ...current,
          discoveryQuestions: {
            ...current.discoveryQuestions,
            [projectId]: (current.discoveryQuestions[projectId] ?? []).map(
              (question) =>
                question.id === questionId
                  ? { ...question, answer, skipped: false, updatedAt: nowIso() }
                  : question
            )
          }
        }));
      },
      skipQuestion(projectId, questionId) {
        setState((current) => ({
          ...current,
          discoveryQuestions: {
            ...current.discoveryQuestions,
            [projectId]: (current.discoveryQuestions[projectId] ?? []).map(
              (question) =>
                question.id === questionId
                  ? { ...question, skipped: true, updatedAt: nowIso() }
                  : question
            )
          }
        }));
      },
      async addQuestion(projectId) {
        const context = contextFor(state, projectId);
        const [question] =
          await mockAiProvider.generateDiscoveryQuestions(context);
        setState((current) => ({
          ...current,
          discoveryQuestions: {
            ...current.discoveryQuestions,
            [projectId]: [
              ...(current.discoveryQuestions[projectId] ?? []),
              {
                ...question,
                id: createId("question"),
                position: (current.discoveryQuestions[projectId] ?? []).length
              }
            ]
          }
        }));
      },
      async generatePrd(projectId) {
        const context = contextFor(state, projectId);
        const prd = await mockAiProvider.generatePRD(context);
        const requirements = await mockAiProvider.generateRequirements({
          ...context,
          prd
        });
        const userStories = await mockAiProvider.generateUserStories({
          ...context,
          prd
        });
        const review = reviewDocument(prd, requirements, userStories);
        setState((current) => ({
          ...current,
          prds: { ...current.prds, [projectId]: prd },
          requirements: { ...current.requirements, [projectId]: requirements },
          userStories: { ...current.userStories, [projectId]: userStories },
          reviews: { ...current.reviews, [projectId]: review },
          projects: current.projects.map((project) =>
            project.id === projectId
              ? { ...project, status: "active", updatedAt: nowIso() }
              : project
          )
        }));
        return prd;
      },
      updateSection(projectId, sectionId, contentText) {
        setState((current) => {
          const prd = current.prds[projectId];
          if (!prd) return current;
          const nextPrd = {
            ...prd,
            updatedAt: nowIso(),
            sections: prd.sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    previousContent: section.contentText,
                    contentText,
                    updatedAt: nowIso()
                  }
                : section
            )
          };
          return {
            ...current,
            prds: { ...current.prds, [projectId]: nextPrd }
          };
        });
      },
      async improveSection(projectId, sectionId, action) {
        const context = contextFor(state, projectId);
        const section = context.prd?.sections.find(
          (item) => item.id === sectionId
        );
        if (!section) return "";
        return mockAiProvider.improveSection(context, section, action);
      },
      restoreSection(projectId, sectionId) {
        setState((current) => {
          const prd = current.prds[projectId];
          if (!prd) return current;
          return {
            ...current,
            prds: {
              ...current.prds,
              [projectId]: {
                ...prd,
                sections: prd.sections.map((section) =>
                  section.id === sectionId && section.previousContent
                    ? {
                        ...section,
                        contentText: section.previousContent,
                        previousContent: undefined
                      }
                    : section
                )
              }
            }
          };
        });
      },
      hideSection(projectId, sectionId) {
        toggleSectionVisibility(projectId, sectionId, false);
      },
      showSection(projectId, sectionId) {
        toggleSectionVisibility(projectId, sectionId, true);
      },
      reorderSection(projectId, sourceSectionId, targetSectionId) {
        setState((current) => {
          const prd = current.prds[projectId];
          if (!prd || sourceSectionId === targetSectionId) return current;
          const source = prd.sections.find(
            (section) => section.id === sourceSectionId
          );
          const targetIndex = prd.sections.findIndex(
            (section) => section.id === targetSectionId
          );
          if (!source || targetIndex < 0) return current;
          const withoutSource = prd.sections.filter(
            (section) => section.id !== sourceSectionId
          );
          withoutSource.splice(targetIndex, 0, source);
          return {
            ...current,
            prds: {
              ...current.prds,
              [projectId]: {
                ...prd,
                sections: withoutSource.map((section, index) => ({
                  ...section,
                  position: index
                }))
              }
            }
          };
        });
      },
      addCustomSection(projectId, title) {
        setState((current) => {
          const prd = current.prds[projectId];
          if (!prd || !title.trim()) return current;
          return {
            ...current,
            prds: {
              ...current.prds,
              [projectId]: {
                ...prd,
                sections: [
                  ...prd.sections,
                  {
                    id: createId("section"),
                    prdId: prd.id,
                    sectionKey: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    title,
                    contentText: "New custom section.",
                    contentJson: { type: "custom" },
                    position: prd.sections.length,
                    isVisible: true,
                    score: 60,
                    updatedAt: nowIso()
                  }
                ]
              }
            }
          };
        });
      },
      addRequirement(projectId, requirement) {
        setState((current) => {
          const prdId = current.prds[projectId]?.id ?? createId("prd");
          const existing = current.requirements[projectId] ?? [];
          const next: Requirement = {
            id: createId("req"),
            projectId,
            prdId,
            requirementCode: `FR-${String(existing.length + 1).padStart(3, "0")}`,
            requirementType: "functional",
            category: "Core workflow",
            title: requirement?.title ?? "New requirement",
            description:
              requirement?.description ??
              "Describe the expected behavior and user outcome.",
            rationale:
              requirement?.rationale ?? "Added from requirements workspace.",
            priority: requirement?.priority ?? "Should have",
            status: requirement?.status ?? "Draft",
            relatedGoal: requirement?.relatedGoal ?? "",
            relatedPersona: requirement?.relatedPersona ?? "",
            acceptanceCriteria: requirement?.acceptanceCriteria ?? [
              "Given context, when the user acts, then the expected result is visible."
            ],
            dependencies: requirement?.dependencies ?? [],
            createdAt: nowIso(),
            updatedAt: nowIso()
          };
          return {
            ...current,
            requirements: {
              ...current.requirements,
              [projectId]: [next, ...existing]
            }
          };
        });
      },
      updateRequirement(projectId, requirementId, patch) {
        setState((current) => ({
          ...current,
          requirements: {
            ...current.requirements,
            [projectId]: (current.requirements[projectId] ?? []).map(
              (requirement) =>
                requirement.id === requirementId
                  ? ({
                      ...requirement,
                      ...patch,
                      updatedAt: nowIso()
                    } as Requirement)
                  : requirement
            )
          }
        }));
      },
      deleteRequirement(projectId, requirementId) {
        setState((current) => ({
          ...current,
          requirements: {
            ...current.requirements,
            [projectId]: (current.requirements[projectId] ?? []).filter(
              (requirement) => requirement.id !== requirementId
            )
          }
        }));
      },
      bulkUpdateRequirements(projectId, requirementIds, patch) {
        setState((current) => ({
          ...current,
          requirements: {
            ...current.requirements,
            [projectId]: (current.requirements[projectId] ?? []).map(
              (requirement) =>
                requirementIds.includes(requirement.id)
                  ? ({
                      ...requirement,
                      ...patch,
                      updatedAt: nowIso()
                    } as Requirement)
                  : requirement
            )
          }
        }));
      },
      runQualityReview(projectId) {
        setState((current) => {
          const review = reviewDocument(
            current.prds[projectId],
            current.requirements[projectId] ?? [],
            current.userStories[projectId] ?? []
          );
          return {
            ...current,
            reviews: { ...current.reviews, [projectId]: review }
          };
        });
      },
      createVersion(projectId, versionName, changeNote) {
        setState((current) => {
          const prd = current.prds[projectId];
          if (!prd) return current;
          const existing = current.versions[projectId] ?? [];
          return {
            ...current,
            versions: {
              ...current.versions,
              [projectId]: [
                ...existing,
                {
                  id: createId("version"),
                  prdId: prd.id,
                  versionNumber: existing.length + 1,
                  versionName,
                  snapshot: clone(prd),
                  changeNote,
                  createdBy: current.profile.id,
                  createdAt: nowIso()
                }
              ]
            }
          };
        });
      },
      restoreVersion(projectId, versionId) {
        setState((current) => {
          const version = (current.versions[projectId] ?? []).find(
            (item) => item.id === versionId
          );
          if (!version) return current;
          return {
            ...current,
            prds: { ...current.prds, [projectId]: clone(version.snapshot) }
          };
        });
      },
      createShareLink(projectId, expiresAt) {
        const token = browserToken();
        const shareLink: ShareLink = {
          id: createId("share"),
          projectId,
          token,
          tokenHash: `demo-${token}`,
          isActive: true,
          expiresAt,
          createdBy: state.profile.id,
          createdAt: nowIso()
        };
        setState((current) => ({
          ...current,
          shareLinks: [shareLink, ...current.shareLinks]
        }));
        return shareLink;
      },
      revokeShareLink(shareLinkId) {
        setState((current) => ({
          ...current,
          shareLinks: current.shareLinks.map((shareLink) =>
            shareLink.id === shareLinkId
              ? { ...shareLink, isActive: false }
              : shareLink
          )
        }));
      }
    }),
    [ready, state]
  );

  function toggleSectionVisibility(
    projectId: string,
    sectionId: string,
    isVisible: boolean
  ) {
    setState((current) => {
      const prd = current.prds[projectId];
      if (!prd) return current;
      return {
        ...current,
        prds: {
          ...current.prds,
          [projectId]: {
            ...prd,
            sections: prd.sections.map((section) =>
              section.id === sectionId ? { ...section, isVisible } : section
            )
          }
        }
      };
    });
  }

  return (
    <DemoStoreContext.Provider value={value}>
      {children}
    </DemoStoreContext.Provider>
  );
}

export function useDemoStore() {
  const context = useContext(DemoStoreContext);
  if (!context) {
    throw new Error("useDemoStore must be used within DemoStoreProvider.");
  }
  return context;
}

export function useProject(projectId: string) {
  const { state } = useDemoStore();
  return {
    project: state.projects.find((project) => project.id === projectId),
    input: state.inputs[projectId],
    prd: state.prds[projectId],
    questions: state.discoveryQuestions[projectId] ?? [],
    requirements: state.requirements[projectId] ?? [],
    userStories: state.userStories[projectId] ?? [],
    review: state.reviews[projectId],
    versions: state.versions[projectId] ?? [],
    shareLinks: state.shareLinks.filter(
      (shareLink) => shareLink.projectId === projectId
    )
  };
}
