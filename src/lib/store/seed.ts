import { PRD_SECTION_TITLES, sectionKey } from "@/lib/ai/sections";
import type {
  DemoState,
  DiscoveryQuestion,
  PrdDocument,
  PrdSection,
  PrdVersion,
  Project,
  ProjectInput,
  QualityReview,
  Requirement,
  ShareLink,
  UserStory
} from "@/types/prd";

const demoNow = "2026-07-10T20:00:00.000Z";

export const emptyInput: ProjectInput = {
  basics: {
    productName: "",
    oneSentenceIdea: "",
    detailedDescription: "",
    productType: "New product",
    platform: "Web app",
    productStage: "Concept",
    industry: "",
    teamSize: "1-5"
  },
  users: {
    primaryUser: "",
    secondaryUsers: "",
    userProblem: "",
    currentAlternatives: "",
    evidence: "",
    userContext: "",
    jobsToBeDone: ""
  },
  strategy: {
    businessObjective: "",
    userOutcome: "",
    productGoals: "",
    successMetrics: "",
    strategicAlignment: "",
    launchWindow: ""
  },
  scope: {
    mustHave: "",
    niceToHave: "",
    nonGoals: "",
    constraints: "",
    dependencies: "",
    risks: "",
    technicalConsiderations: ""
  },
  context: {
    researchNotes: "",
    meetingNotes: "",
    customerFindings: "",
    competitorNotes: "",
    referenceLinks: "",
    templateKey: "new-product"
  }
};

const campusInput: ProjectInput = {
  basics: {
    productName: "Campus Club Application Hub",
    oneSentenceIdea:
      "A university platform that centralizes student organization discovery, applications, deadlines, and role-based club administration.",
    detailedDescription:
      "Students currently search across scattered spreadsheets, flyers, group chats, and department pages to discover clubs and track applications. Club leaders manage deadlines and applicant reviews manually, which creates missed opportunities and inconsistent communication.",
    productType: "Internal platform",
    platform: "Responsive web app",
    productStage: "Discovery",
    industry: "Education",
    teamSize: "6-10"
  },
  users: {
    primaryUser: "Undergraduate students applying to campus clubs",
    secondaryUsers:
      "Club officers, student affairs administrators, and faculty advisors",
    userProblem:
      "Students miss relevant clubs and deadlines because discovery, eligibility, application status, and officer communication are fragmented across many channels.",
    currentAlternatives:
      "Social posts, campus emails, PDF lists, club fairs, spreadsheets, and word of mouth.",
    evidence:
      "Student interviews cite missed deadlines and confusion about club eligibility.",
    userContext:
      "Most students browse on mobile between classes, then complete longer applications on laptops.",
    jobsToBeDone:
      "When joining campus communities, students want one place to find organizations, compare fit, submit applications, and track next steps."
  },
  strategy: {
    businessObjective:
      "Increase student participation and reduce manual administration for clubs.",
    userOutcome:
      "Students can find relevant clubs and submit complete applications before deadlines.",
    productGoals:
      "Increase completed club applications\nReduce missed application deadlines\nReduce officer time spent answering status questions",
    successMetrics:
      "25% increase in completed applications by the second application cycle\n90% of listed clubs publish deadline data\n30% reduction in status-question emails",
    strategicAlignment:
      "Supports student engagement, belonging, and administrative efficiency.",
    launchWindow: "Pilot with 20 clubs during the fall application cycle"
  },
  scope: {
    mustHave:
      "Browse and search clubs\nFilter by interest, eligibility, deadline, and meeting cadence\nSubmit standardized applications\nTrack application status\nOfficer review queue\nDeadline reminders",
    niceToHave:
      "Recommendation engine\nEvent calendar integration\nAdvisor approvals",
    nonGoals:
      "Replacing official student organization registration; collecting payment dues in v1.",
    constraints:
      "Must support university SSO in production and mobile web usage.",
    dependencies:
      "Student organization roster export, SSO configuration, student affairs policy review.",
    risks:
      "Clubs may not keep profiles current. Mitigation: require deadline freshness reminders and admin completeness checks.",
    technicalConsiderations:
      "Role-based permissions, audit logs, and CSV import/export for club rosters."
  },
  context: {
    researchNotes:
      "Interview notes show students prioritize deadline clarity, eligibility, and real status updates.",
    meetingNotes:
      "Student affairs wants a pilot that does not replace official registration systems.",
    customerFindings:
      "Club officers need applicant triage and bulk communication.",
    competitorNotes:
      "Generic event platforms lack application and review workflows.",
    referenceLinks:
      "Internal student affairs policy page; student organization roster export.",
    templateKey: "student-project"
  }
};

const clinicalInput: ProjectInput = {
  basics: {
    productName: "Safe Clinical Reasoning Assistant",
    oneSentenceIdea:
      "A decision-support concept that reviews uncertain clinical reasoning and flags missing evidence, conflicts, and safety concerns.",
    detailedDescription:
      "The assistant reviews clinician-entered reasoning notes and flags possible missing evidence, contradictions, medication safety concerns, and escalation considerations. It is explicitly not medical advice and does not diagnose or recommend treatment.",
    productType: "AI-assisted workflow",
    platform: "Secure web app",
    productStage: "Concept",
    industry: "Healthcare",
    teamSize: "3-5"
  },
  users: {
    primaryUser: "Clinical trainees and supervising clinicians",
    secondaryUsers: "Patient safety reviewers and clinical education teams",
    userProblem:
      "Clinical reasoning can contain uncertainty, missing evidence, or conflicting details that are hard to notice during time-constrained review.",
    currentAlternatives:
      "Manual attending review, checklists, case conferences, and documentation audits.",
    evidence:
      "Prototype research should be reviewed by clinical safety experts before any real-world use.",
    userContext:
      "Users work with sensitive information and need safe, review-only feedback.",
    jobsToBeDone:
      "When reviewing a complex case, clinicians want a structured safety check that highlights uncertainty and missing evidence without replacing judgment."
  },
  strategy: {
    businessObjective:
      "Explore safer clinical reasoning education and review workflows.",
    userOutcome:
      "Clinicians can identify reasoning gaps and clarify next review steps.",
    productGoals:
      "Flag missing evidence\nIdentify conflicting statements\nSurface safety concerns\nDocument uncertainty",
    successMetrics:
      "Expert-reviewed safety flags have at least 80% usefulness rating in simulated cases\nZero product copy presents output as medical advice",
    strategicAlignment: "Supports safety-oriented education and human review.",
    launchWindow: "Simulation-only prototype; no patient-care launch"
  },
  scope: {
    mustHave:
      "Accept pasted simulated case notes\nFlag missing evidence\nFlag internal contradictions\nShow safety disclaimer\nRequire human review acknowledgment",
    niceToHave:
      "Structured rubric scoring\nSupervisor comments\nDe-identified case library",
    nonGoals:
      "Diagnosis, treatment recommendations, autonomous triage, or patient-facing advice.",
    constraints:
      "Must not ingest real PHI in demo. Requires clinical safety review before production.",
    dependencies:
      "Clinical safety advisor review, privacy impact assessment, model evaluation dataset.",
    risks:
      "Risk: users may over-rely on AI output. Mitigation: prominent not-medical-advice framing and human-review workflow.",
    technicalConsiderations:
      "Strict audit logging, PHI controls, prompt injection protection, and safe output boundaries."
  },
  context: {
    researchNotes:
      "Use simulation-only cases. Clearly state this is not medical advice.",
    meetingNotes:
      "The product should focus on reasoning review, not treatment suggestions.",
    customerFindings: "Educators want explainable flags and uncertainty notes.",
    competitorNotes:
      "General chatbots do not provide enough safety framing for this use case.",
    referenceLinks: "Internal safety evaluation checklist.",
    templateKey: "ai-ml-feature"
  }
};

const nonprofitInput: ProjectInput = {
  basics: {
    productName: "Nonprofit Inventory Manager",
    oneSentenceIdea:
      "A warehouse inventory application for tracking donated school supplies, fulfillment, discrepancies, and audit workflows.",
    detailedDescription:
      "A nonprofit collects donated school supplies, stores them across warehouse zones, and fulfills requests from teachers and community partners. The team needs accurate stock counts, discrepancy handling, and simple audit reporting.",
    productType: "Internal tool",
    platform: "Web app",
    productStage: "Draft",
    industry: "Nonprofit operations",
    teamSize: "6-10"
  },
  users: {
    primaryUser: "Warehouse volunteers and operations coordinators",
    secondaryUsers: "Program managers, auditors, and partner school contacts",
    userProblem:
      "Inventory counts drift because donations, fulfillment, and discrepancy corrections happen in separate spreadsheets and paper logs.",
    currentAlternatives:
      "Shared spreadsheets, printed pick lists, handwritten donation forms.",
    evidence:
      "Operations team reports recurring stock mismatches at fulfillment time.",
    userContext:
      "Users need quick mobile-friendly updates from warehouse aisles.",
    jobsToBeDone:
      "When supplies move through the warehouse, staff need to record counts and discrepancies immediately so fulfillment promises stay accurate."
  },
  strategy: {
    businessObjective: "Improve fulfillment reliability and audit readiness.",
    userOutcome:
      "Staff can trust available counts and resolve mismatches before orders are packed.",
    productGoals:
      "Reduce stock discrepancies\nSpeed up fulfillment\nCreate auditable inventory changes",
    successMetrics:
      "Reduce unresolved discrepancies by 40% after two inventory cycles.",
    strategicAlignment:
      "Supports program reliability and donor accountability.",
    launchWindow: "Before back-to-school campaign"
  },
  scope: {
    mustHave:
      "Create donation intake\nUpdate stock counts\nGenerate pick lists\nRecord discrepancies\nExport audit report",
    niceToHave:
      "Barcode scanning\nPartner self-service requests\nDonor acknowledgment workflow",
    nonGoals: "Full accounting system or volunteer scheduling.",
    constraints:
      "Must work on shared tablets and low-connectivity warehouse areas.",
    dependencies:
      "Current item taxonomy, warehouse zone labels, audit requirements.",
    risks:
      "Volunteer adoption may be low if the interface is slow. Mitigation: optimize core count update flow.",
    technicalConsiderations:
      "Offline-friendly draft queue could be considered after v1."
  },
  context: {
    researchNotes: "",
    meetingNotes: "",
    customerFindings: "",
    competitorNotes: "",
    referenceLinks: "",
    templateKey: "internal-tool"
  }
};

const projects: Project[] = [
  {
    id: "project_campus",
    ownerId: "demo_user",
    name: "Campus Club Application Hub",
    description: campusInput.basics.oneSentenceIdea,
    productType: "Internal platform",
    industry: "Education",
    platform: "Responsive web app",
    stage: "Discovery",
    status: "completed",
    createdAt: "2026-05-08T14:00:00.000Z",
    updatedAt: "2026-05-15T19:00:00.000Z"
  },
  {
    id: "project_clinical",
    ownerId: "demo_user",
    name: "Safe Clinical Reasoning Assistant",
    description: clinicalInput.basics.oneSentenceIdea,
    productType: "AI-assisted workflow",
    industry: "Healthcare",
    platform: "Secure web app",
    stage: "Concept",
    status: "active",
    createdAt: "2026-05-12T14:00:00.000Z",
    updatedAt: "2026-05-18T15:30:00.000Z"
  },
  {
    id: "project_nonprofit",
    ownerId: "demo_user",
    name: "Nonprofit Inventory Manager",
    description: nonprofitInput.basics.oneSentenceIdea,
    productType: "Internal tool",
    industry: "Nonprofit operations",
    platform: "Web app",
    stage: "Draft",
    status: "draft",
    createdAt: "2026-05-10T10:00:00.000Z",
    updatedAt: "2026-05-10T10:00:00.000Z"
  }
];

function section(
  prdId: string,
  title: string,
  position: number,
  contentText: string,
  score = 86
): PrdSection {
  return {
    id: `section_${sectionKey(title)}`,
    prdId,
    sectionKey: sectionKey(title),
    title,
    contentText,
    contentJson: { type: "seed" },
    position,
    isVisible: true,
    score,
    updatedAt: demoNow
  };
}

function makePrd(
  projectId: string,
  title: string,
  input: ProjectInput,
  prdId: string,
  partial = false
): PrdDocument {
  const custom: Record<string, string> = {
    "Document metadata": `Product: ${title.replace(" PRD", "")}\nOwner: Demo Product Team\nStatus: ${partial ? "Draft" : "Ready for review"}\nGenerated: ${demoNow.slice(0, 10)}`,
    "Executive summary": `${input.basics.productName} addresses a specific workflow gap for ${input.users.primaryUser}. The PRD keeps assumptions explicit and connects requirements to measurable launch outcomes.`,
    "Problem statement": input.users.userProblem,
    Goals: input.strategy.productGoals,
    "Functional requirements": input.scope.mustHave
      .split("\n")
      .map((item, index) => `FR-${String(index + 1).padStart(3, "0")}: ${item}`)
      .join("\n"),
    "Security and privacy considerations":
      projectId === "project_clinical"
        ? "This concept is not medical advice. It must not ingest real PHI in demo mode and must require human review before any clinical use."
        : "Private projects by default, role-based access in production, hashed share tokens, and safe upload validation.",
    "Open questions": partial
      ? "- What expert review threshold is required before simulation testing?\n- Which safety flags block launch?"
      : "- Which clubs join the first pilot?\n- What deadline source is authoritative?"
  };

  const sections = PRD_SECTION_TITLES.map((titleValue, index) =>
    section(
      prdId,
      titleValue,
      index,
      custom[titleValue] ||
        `${input.basics.productName}: ${titleValue.toLowerCase()} details will be refined with discovery answers and reviewer feedback.`,
      partial && index > 16 ? 58 : 84
    )
  );

  return {
    id: prdId,
    projectId,
    title,
    status: partial ? "draft" : "ready",
    overallScore: partial ? 66 : 86,
    aiProvider: "mock",
    aiModel: "deterministic-demo",
    schemaVersion: "1.0.0",
    assumptions: [
      "Pilot data and launch targets require owner confirmation.",
      "User-provided context has not been independently verified."
    ],
    openQuestions: custom["Open questions"]
      .split("\n")
      .map((item) => item.replace(/^- /, "")),
    sections,
    createdAt: demoNow,
    updatedAt: demoNow
  };
}

const campusPrd = makePrd(
  "project_campus",
  "Campus Club Application Hub PRD",
  campusInput,
  "prd_campus"
);
const clinicalPrd = makePrd(
  "project_clinical",
  "Safe Clinical Reasoning Assistant PRD",
  clinicalInput,
  "prd_clinical",
  true
);

const campusRequirements: Requirement[] = [
  "Browse and search clubs",
  "Filter by interest, eligibility, deadline, and meeting cadence",
  "Submit standardized applications",
  "Track application status",
  "Officer review queue",
  "Deadline reminders"
].map((title, index) => ({
  id: `req_campus_${index + 1}`,
  projectId: "project_campus",
  prdId: "prd_campus",
  requirementCode: `FR-${String(index + 1).padStart(3, "0")}`,
  requirementType: "functional",
  category: "Student workflow",
  title,
  description: `${title} must support students and officers during the club application cycle.`,
  rationale: "This requirement maps to the primary application hub workflow.",
  priority: index < 3 ? "Must have" : "Should have",
  status: index < 2 ? "Approved" : index < 4 ? "Ready for review" : "Draft",
  relatedGoal: campusInput.strategy.productGoals.split("\n")[0],
  relatedPersona: campusInput.users.primaryUser,
  acceptanceCriteria: [
    "Given a student is signed in, when they use this capability, then the outcome is saved to the project record.",
    "Given missing or invalid input, when the action is submitted, then an accessible error explains the fix."
  ],
  dependencies: [],
  createdAt: demoNow,
  updatedAt: demoNow
}));

const clinicalRequirements: Requirement[] = [
  {
    id: "req_clinical_1",
    projectId: "project_clinical",
    prdId: "prd_clinical",
    requirementCode: "FR-001",
    requirementType: "functional",
    category: "Reasoning review",
    title: "Show not-medical-advice disclaimer",
    description:
      "Every review screen must state that output is for simulated reasoning support and is not medical advice.",
    rationale:
      "Safety framing prevents over-reliance and unsupported clinical use.",
    priority: "Must have",
    status: "Approved",
    relatedGoal: "Surface safety concerns",
    relatedPersona: clinicalInput.users.primaryUser,
    acceptanceCriteria: [
      "Given a user opens the review flow, when any AI output is visible, then the disclaimer is visible before the output."
    ],
    dependencies: [],
    createdAt: demoNow,
    updatedAt: demoNow
  }
];

const stories: Record<string, UserStory[]> = {
  project_campus: [
    {
      id: "story_campus_1",
      projectId: "project_campus",
      prdId: "prd_campus",
      storyCode: "US-001",
      persona: campusInput.users.primaryUser,
      story:
        "As an undergraduate student, I want to search clubs by interest and deadline, so that I can find relevant opportunities before applications close.",
      userValue: "Students find fit and avoid missed deadlines.",
      priority: "Must have",
      status: "Ready for review",
      acceptanceCriteria: [
        "Given a student searches, when matching clubs exist, then results show deadline and eligibility."
      ],
      relatedRequirementIds: ["req_campus_1", "req_campus_2"],
      createdAt: demoNow,
      updatedAt: demoNow
    }
  ],
  project_clinical: [],
  project_nonprofit: []
};

const campusReview: QualityReview = {
  id: "review_campus",
  prdId: "prd_campus",
  overallScore: 86,
  categoryScores: {
    "Problem clarity": 92,
    "User understanding": 88,
    "Goal quality": 84,
    "Scope clarity": 86,
    "Requirement completeness": 88,
    "Requirement testability": 82,
    "Metric quality": 80,
    "Risk coverage": 78,
    "Technical feasibility": 84,
    "Launch readiness": 76
  },
  issues: [
    {
      id: "issue_campus_1",
      severity: "warning",
      sectionKey: "success-metrics",
      title: "Metric target needs owner confirmation",
      description:
        "Confirm whether the 25% application increase is realistic for the pilot.",
      rule: "metric_target_owner"
    }
  ],
  recommendations: [
    "Confirm pilot club cohort",
    "Assign owner for deadline source"
  ],
  strongSections: ["Problem statement", "Functional requirements"],
  weakSections: ["success-metrics"],
  createdAt: demoNow
};

const versions: Record<string, PrdVersion[]> = {
  project_campus: [
    {
      id: "version_campus_1",
      prdId: "prd_campus",
      versionNumber: 1,
      versionName: "Initial discovery draft",
      snapshot: { ...campusPrd, overallScore: 72 },
      changeNote: "Generated from intake and first discovery answers.",
      createdBy: "demo_user",
      createdAt: "2026-05-12T15:00:00.000Z"
    },
    {
      id: "version_campus_2",
      prdId: "prd_campus",
      versionNumber: 2,
      versionName: "Review-ready pilot draft",
      snapshot: campusPrd,
      changeNote:
        "Added measurable success metrics and officer workflow requirements.",
      createdBy: "demo_user",
      createdAt: "2026-05-15T19:00:00.000Z"
    }
  ],
  project_clinical: [],
  project_nonprofit: []
};

const shareLinks: ShareLink[] = [
  {
    id: "share_campus",
    projectId: "project_campus",
    token: "demo-campus-share",
    tokenHash: "demo-campus-share-hash",
    isActive: true,
    createdBy: "demo_user",
    createdAt: demoNow
  }
];

function questions(
  projectId: string,
  input: ProjectInput
): DiscoveryQuestion[] {
  return [
    {
      id: `question_${projectId}_1`,
      projectId,
      category: "User",
      question: "Which first-release user segment is highest priority?",
      rationale: "A prioritized persona improves scope decisions.",
      suggestedAnswers: [
        "Pilot users",
        "Highest-frequency users",
        "Highest-risk users"
      ],
      answer: input.users.primaryUser,
      skipped: false,
      position: 0,
      createdAt: demoNow,
      updatedAt: demoNow
    },
    {
      id: `question_${projectId}_2`,
      projectId,
      category: "Success",
      question: "Which metric should define v1 launch success?",
      rationale: "A measurable target helps the PRD pass quality review.",
      suggestedAnswers: ["Activation", "Completion", "Error reduction"],
      answer: input.strategy.successMetrics,
      skipped: false,
      position: 1,
      createdAt: demoNow,
      updatedAt: demoNow
    }
  ];
}

export function createInitialDemoState(): DemoState {
  return {
    profile: {
      id: "demo_user",
      fullName: "Alex Kim",
      email: "alex.kim@demo.local",
      role: "Product manager",
      createdAt: demoNow,
      updatedAt: demoNow
    },
    projects,
    inputs: {
      project_campus: campusInput,
      project_clinical: clinicalInput,
      project_nonprofit: nonprofitInput
    },
    discoveryQuestions: {
      project_campus: questions("project_campus", campusInput),
      project_clinical: questions("project_clinical", clinicalInput),
      project_nonprofit: []
    },
    prds: {
      project_campus: campusPrd,
      project_clinical: clinicalPrd
    },
    requirements: {
      project_campus: campusRequirements,
      project_clinical: clinicalRequirements,
      project_nonprofit: []
    },
    userStories: stories,
    reviews: {
      project_campus: campusReview
    },
    versions,
    shareLinks,
    demoMode: true
  };
}
