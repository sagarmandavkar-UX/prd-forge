"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  FileUp,
  Save
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { templates } from "@/features/templates/templates";
import { analytics } from "@/lib/analytics/events";
import { isAllowedUpload, sanitizeText } from "@/lib/security/sanitize";
import { emptyInput } from "@/lib/store/seed";
import {
  projectInputSchema,
  type ProjectInputForm
} from "@/lib/validation/prd";
import { useDebouncedEffect } from "@/hooks/use-debounced-effect";
import { useDemoStore } from "@/providers/demo-store-provider";

const DRAFT_KEY = "prd-forge.intake-draft";

const steps = [
  {
    label: "Basics",
    description: "Product name, stage, platform, and category."
  },
  {
    label: "Users & Problem",
    description: "Primary user, problem, evidence, and jobs to be done."
  },
  {
    label: "Goals & Strategy",
    description:
      "Business objective, user outcome, success metrics, and launch window."
  },
  {
    label: "Scope",
    description:
      "Must-haves, nice-to-haves, non-goals, constraints, dependencies, and risks."
  },
  {
    label: "Context",
    description:
      "Research notes, meeting notes, competitor notes, links, uploads, and templates."
  },
  {
    label: "Review",
    description: "Confirm the intake before generating discovery questions."
  }
];

export function ProjectIntakeForm() {
  const router = useRouter();
  const { createProject } = useDemoStore();
  const [step, setStep] = useState(0);
  const [saveState, setSaveState] = useState("No changes yet");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const defaultValues = useMemo<ProjectInputForm>(() => {
    if (typeof window === "undefined") return emptyInput;
    const draft = window.localStorage.getItem(DRAFT_KEY);
    return draft ? (JSON.parse(draft) as ProjectInputForm) : emptyInput;
  }, []);

  const form = useForm<ProjectInputForm>({
    resolver: zodResolver(projectInputSchema),
    defaultValues,
    mode: "onBlur"
  });

  const values = useWatch({ control: form.control });

  useDebouncedEffect(
    () => {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      setSaveState("Autosaved just now");
    },
    [values],
    700
  );

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  async function complete(data: ProjectInputForm) {
    setSubmitting(true);
    setFormError("");
    const project = await createProject(data);
    analytics.track("project_created", {
      projectType: data.basics.productType
    });
    window.localStorage.removeItem(DRAFT_KEY);
    router.push(`/projects/${project.id}/discovery`);
  }

  async function saveDraft() {
    const current = form.getValues();
    const data: ProjectInputForm = {
      ...current,
      basics: {
        ...current.basics,
        productName: current.basics.productName || "Untitled PRD",
        oneSentenceIdea:
          current.basics.oneSentenceIdea || "Draft product idea.",
        detailedDescription:
          current.basics.detailedDescription ||
          "Draft description to refine later.",
        industry: current.basics.industry || "General"
      },
      users: {
        ...current.users,
        primaryUser: current.users.primaryUser || "Primary user",
        userProblem:
          current.users.userProblem || "Problem to clarify during discovery."
      },
      strategy: {
        ...current.strategy,
        businessObjective:
          current.strategy.businessObjective || "Business objective to refine.",
        userOutcome: current.strategy.userOutcome || "User outcome to refine.",
        productGoals:
          current.strategy.productGoals || "Product goals to refine.",
        successMetrics:
          current.strategy.successMetrics || "Success metrics to refine."
      },
      scope: {
        ...current.scope,
        mustHave: current.scope.mustHave || "Core capability to refine."
      }
    };
    const project = await createProject(data);
    router.push(`/projects/${project.id}`);
  }

  async function handleFile(file?: File) {
    if (!file) return;
    if (!isAllowedUpload(file.name, file.size)) {
      setFormError("Upload must be a .txt or .md file under 5MB.");
      return;
    }
    const text = sanitizeText(await file.text());
    form.setValue("context.uploadedFileName", file.name, { shouldDirty: true });
    form.setValue("context.uploadedText", text, { shouldDirty: true });
    setFormError("");
  }

  return (
    <AppShell
      title="New Project"
      description="Guide the mock AI with enough product context to create useful discovery questions."
      actions={
        <Button variant="outline" onClick={saveDraft}>
          <Save className="h-4 w-4" aria-hidden="true" />
          Save draft
        </Button>
      }
    >
      <form
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8"
        onSubmit={form.handleSubmit(complete)}
      >
        <div className="rounded-lg border bg-card">
          <div className="border-b p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold">Project intake</h1>
                  <Badge tone="blue">Demo mode</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {steps[step].description}
                </p>
              </div>
              <p className="text-sm text-emerald-700">{saveState}</p>
            </div>
            <div className="mt-5 space-y-3">
              <Progress value={((step + 1) / steps.length) * 100} />
              <ol className="grid gap-2 text-sm md:grid-cols-6">
                {steps.map((item, index) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => setStep(index)}
                      className={`focus-ring w-full rounded-md border px-3 py-2 text-left ${
                        index === step
                          ? "border-primary bg-accent text-accent-foreground"
                          : "bg-background"
                      }`}
                    >
                      <span className="block text-xs text-muted-foreground">
                        Step {index + 1}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="p-5">
            {formError ? (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm"
              >
                <AlertTriangle
                  className="mt-0.5 h-4 w-4 text-destructive"
                  aria-hidden="true"
                />
                <p>{formError}</p>
              </div>
            ) : null}
            <StepFields step={step} form={form} onFile={handleFile} />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t p-5 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" onClick={saveDraft}>
                Save as draft
              </Button>
              {step < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={() =>
                    setStep((current) =>
                      Math.min(steps.length - 1, current + 1)
                    )
                  }
                >
                  Next: {steps[step + 1].label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Generating..."
                    : "Generate discovery questions"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </AppShell>
  );
}

function Field({
  label,
  hint,
  children,
  error
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <div className="mt-2">{children}</div>
      {hint ? (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{hint}</p>
      ) : null}
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </label>
  );
}

function StepFields({
  step,
  form,
  onFile
}: {
  step: number;
  form: ReturnType<typeof useForm<ProjectInputForm>>;
  onFile: (file?: File) => void;
}) {
  const errors = form.formState.errors;
  if (step === 0) {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Product name" error={errors.basics?.productName?.message}>
          <Input
            {...form.register("basics.productName")}
            placeholder="Campus Club Application Hub"
          />
        </Field>
        <Field label="Product type">
          <Select {...form.register("basics.productType")}>
            <option>New product</option>
            <option>Feature launch</option>
            <option>Internal tool</option>
            <option>AI-assisted workflow</option>
            <option>API product</option>
          </Select>
        </Field>
        <Field
          label="One-sentence idea"
          hint="Example: A workspace that turns rough product ideas into editable PRDs."
          error={errors.basics?.oneSentenceIdea?.message}
        >
          <Input {...form.register("basics.oneSentenceIdea")} />
        </Field>
        <Field label="Platform">
          <Select {...form.register("basics.platform")}>
            <option>Web app</option>
            <option>Responsive web app</option>
            <option>Mobile app</option>
            <option>API</option>
            <option>Internal platform</option>
          </Select>
        </Field>
        <Field
          label="Detailed description"
          error={errors.basics?.detailedDescription?.message}
        >
          <Textarea {...form.register("basics.detailedDescription")} rows={6} />
        </Field>
        <div className="grid gap-5">
          <Field label="Product stage">
            <Select {...form.register("basics.productStage")}>
              <option>Concept</option>
              <option>Discovery</option>
              <option>Design</option>
              <option>Build</option>
              <option>Launch</option>
            </Select>
          </Field>
          <Field label="Industry">
            <Input
              {...form.register("basics.industry")}
              placeholder="Education"
            />
          </Field>
          <Field label="Team size">
            <Select {...form.register("basics.teamSize")}>
              <option>1-5</option>
              <option>6-10</option>
              <option>11-25</option>
              <option>26+</option>
            </Select>
          </Field>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Primary user">
          <Input {...form.register("users.primaryUser")} />
        </Field>
        <Field label="Secondary users">
          <Input {...form.register("users.secondaryUsers")} />
        </Field>
        <Field label="User problem">
          <Textarea {...form.register("users.userProblem")} rows={5} />
        </Field>
        <Field label="Current alternatives">
          <Textarea {...form.register("users.currentAlternatives")} rows={5} />
        </Field>
        <Field label="Evidence of the problem">
          <Textarea {...form.register("users.evidence")} rows={4} />
        </Field>
        <Field label="User context">
          <Textarea {...form.register("users.userContext")} rows={4} />
        </Field>
        <Field label="Jobs to be done">
          <Textarea {...form.register("users.jobsToBeDone")} rows={4} />
        </Field>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Business objective">
          <Textarea {...form.register("strategy.businessObjective")} rows={4} />
        </Field>
        <Field label="User outcome">
          <Textarea {...form.register("strategy.userOutcome")} rows={4} />
        </Field>
        <Field label="Product goals">
          <Textarea {...form.register("strategy.productGoals")} rows={5} />
        </Field>
        <Field label="Proposed success metrics">
          <Textarea {...form.register("strategy.successMetrics")} rows={5} />
        </Field>
        <Field label="Strategic alignment">
          <Textarea
            {...form.register("strategy.strategicAlignment")}
            rows={4}
          />
        </Field>
        <Field label="Desired launch window">
          <Input
            {...form.register("strategy.launchWindow")}
            placeholder="Pilot in Q4"
          />
        </Field>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Must-have capabilities">
          <Textarea {...form.register("scope.mustHave")} rows={6} />
        </Field>
        <Field label="Nice-to-have capabilities">
          <Textarea {...form.register("scope.niceToHave")} rows={6} />
        </Field>
        <Field label="Non-goals">
          <Textarea {...form.register("scope.nonGoals")} rows={4} />
        </Field>
        <Field label="Constraints">
          <Textarea {...form.register("scope.constraints")} rows={4} />
        </Field>
        <Field label="Dependencies">
          <Textarea {...form.register("scope.dependencies")} rows={4} />
        </Field>
        <Field label="Risks">
          <Textarea {...form.register("scope.risks")} rows={4} />
        </Field>
        <Field label="Technical considerations">
          <Textarea
            {...form.register("scope.technicalConsiderations")}
            rows={4}
          />
        </Field>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Template">
          <Select {...form.register("context.templateKey")}>
            {templates.map((template) => (
              <option key={template.key} value={template.key}>
                {template.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Text or Markdown upload"
          hint="Supports .txt, .md, and .markdown files up to 5MB. URLs are saved as text only."
        >
          <div className="rounded-lg border border-dashed bg-background p-6 text-center">
            <FileUp
              className="mx-auto h-6 w-6 text-primary"
              aria-hidden="true"
            />
            <Input
              className="mt-4"
              type="file"
              accept=".txt,.md,.markdown"
              onChange={(event) => onFile(event.target.files?.[0])}
            />
            {form.watch("context.uploadedFileName") ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Attached {form.watch("context.uploadedFileName")}
              </p>
            ) : null}
          </div>
        </Field>
        <Field label="Research notes">
          <Textarea {...form.register("context.researchNotes")} rows={5} />
        </Field>
        <Field label="Meeting notes">
          <Textarea {...form.register("context.meetingNotes")} rows={5} />
        </Field>
        <Field label="Customer interview findings">
          <Textarea {...form.register("context.customerFindings")} rows={4} />
        </Field>
        <Field label="Competitor notes">
          <Textarea {...form.register("context.competitorNotes")} rows={4} />
        </Field>
        <Field label="Reference links as text">
          <Textarea {...form.register("context.referenceLinks")} rows={4} />
        </Field>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {[
          ["Product", form.watch("basics.productName") || "Untitled"],
          ["Primary user", form.watch("users.primaryUser") || "Not supplied"],
          ["Problem", form.watch("users.userProblem") || "Not supplied"],
          ["Goals", form.watch("strategy.productGoals") || "Not supplied"],
          ["Must-have scope", form.watch("scope.mustHave") || "Not supplied"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border bg-background p-4">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
              {value}
            </p>
          </div>
        ))}
      </div>
      <aside className="rounded-lg border bg-background p-4">
        <h2 className="font-semibold">PRD preview outline</h2>
        <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
          {[
            "Overview",
            "Problem statement",
            "Users and personas",
            "Requirements",
            "Success metrics",
            "Risks",
            "Launch readiness"
          ].map((item, index) => (
            <li key={item}>
              {index + 1}. {item}
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
