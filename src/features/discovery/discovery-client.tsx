"use client";

import { ArrowRight, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell, EmptyState } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ProjectNav } from "@/features/projects/project-nav";
import { analytics } from "@/lib/analytics/events";
import { useDemoStore, useProject } from "@/providers/demo-store-provider";

export function DiscoveryClient({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { project, questions, prd } = useProject(projectId);
  const {
    answerQuestion,
    skipQuestion,
    addQuestion,
    generateDiscovery,
    generatePrd
  } = useDemoStore();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const answered = questions.filter(
    (question) => question.answer || question.skipped
  ).length;
  const progress = questions.length ? (answered / questions.length) * 100 : 0;

  async function continueToPrd() {
    setLoading(true);
    if (!prd) {
      await generatePrd(projectId);
      analytics.track("prd_generated");
    }
    analytics.track("discovery_completed");
    setLoading(false);
    router.push(`/projects/${projectId}/prd`);
  }

  if (!project) {
    return (
      <AppShell title="Missing project">
        <div className="p-6">
          <EmptyState
            title="Project not found"
            description="The project may have been deleted from demo mode."
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      aside={<ProjectNav projectId={projectId} />}
      title="Discovery"
      description="Answer focused follow-up questions before generating or refining the PRD."
      actions={
        <Button onClick={continueToPrd} disabled={loading}>
          {loading ? "Generating..." : prd ? "Open PRD" : "Generate PRD"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      }
    >
      <div className="space-y-6 p-4 sm:p-6">
        <section className="rounded-lg border bg-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                <h1 className="text-2xl font-semibold">
                  AI discovery assistant
                </h1>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Questions are generated from supplied context and avoid asking
                for information already present.
              </p>
            </div>
            <div className="min-w-64">
              <div className="mb-2 flex justify-between text-sm">
                <span>
                  Answered {answered} of {questions.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </div>
        </section>

        {questions.length ? (
          <div className="grid gap-4">
            {questions.map((question) => (
              <article
                key={question.id}
                className="rounded-lg border bg-card p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <Badge tone="blue">{question.category}</Badge>
                    <h2 className="mt-3 text-base font-semibold">
                      {question.question}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {question.rationale}
                    </p>
                    {question.suggestedAnswers.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {question.suggestedAnswers.map((suggestion) => (
                          <Button
                            key={suggestion}
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setAnswers((current) => ({
                                ...current,
                                [question.id]: suggestion
                              }));
                              answerQuestion(
                                projectId,
                                question.id,
                                suggestion
                              );
                            }}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => skipQuestion(projectId, question.id)}
                    >
                      Skip
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium">
                    Answer
                    <Textarea
                      className="mt-2"
                      value={answers[question.id] ?? question.answer}
                      onChange={(event) =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: event.target.value
                        }))
                      }
                      onBlur={(event) =>
                        answerQuestion(
                          projectId,
                          question.id,
                          event.target.value
                        )
                      }
                      rows={3}
                    />
                  </label>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No discovery questions yet"
            description="Generate questions from the project intake, then answer or skip each one."
            action={
              <Button onClick={() => generateDiscovery(projectId)}>
                Generate questions
              </Button>
            }
          />
        )}

        <div className="flex flex-col gap-3 rounded-lg border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Add more context</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate one more relevant question or continue to the PRD editor.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => addQuestion(projectId)}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Another question
            </Button>
            <Button type="button" onClick={continueToPrd} disabled={loading}>
              {loading ? "Generating..." : "Continue to PRD"}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
