"use client";

import Link from "next/link";
import { ArrowRight, FileText, Share2, Sparkles } from "lucide-react";

import {
  AppShell,
  EmptyState,
  ProjectSummaryStrip
} from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectNav } from "@/features/projects/project-nav";
import { useProject } from "@/providers/demo-store-provider";

export function ProjectOverview({ projectId }: { projectId: string }) {
  const { project, input, prd, requirements, review, shareLinks } =
    useProject(projectId);

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
      title={project.name}
      description={project.description}
      actions={
        <Button asChild>
          <Link href={`/projects/${projectId}/prd`}>
            Open PRD
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-6 p-4 sm:p-6">
        <section className="rounded-lg border bg-card">
          <div className="p-5">
            <h1 className="text-2xl font-semibold">{project.name}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {project.description}
            </p>
          </div>
          <ProjectSummaryStrip
            quality={prd?.overallScore ?? 0}
            requirements={requirements.length}
            updatedAt={project.updatedAt}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-semibold">Discovery</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Answer or skip follow-up questions before generating or improving
              the PRD.
            </p>
            <Button asChild className="mt-5" variant="outline">
              <Link href={`/projects/${projectId}/discovery`}>
                Review questions
              </Link>
            </Button>
          </Card>
          <Card className="p-5">
            <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-semibold">Document</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {prd
                ? "Edit sections, run AI actions, export, and inspect quality."
                : "Generate the first PRD from intake and discovery."}
            </p>
            <Button asChild className="mt-5" variant="outline">
              <Link
                href={
                  prd
                    ? `/projects/${projectId}/prd`
                    : `/projects/${projectId}/discovery`
                }
              >
                {prd ? "Open editor" : "Generate PRD"}
              </Link>
            </Button>
          </Card>
          <Card className="p-5">
            <Share2 className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-semibold">Sharing</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {shareLinks.some((link) => link.isActive)
                ? "A demo share link is active for this project."
                : "Create an unguessable read-only share link from the PRD editor."}
            </p>
            <Button asChild className="mt-5" variant="outline">
              <Link href={`/projects/${projectId}/prd`}>Manage share link</Link>
            </Button>
          </Card>
        </section>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="font-semibold">Intake summary</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {[
              ["Primary user", input?.users.primaryUser],
              ["Problem", input?.users.userProblem],
              ["Goals", input?.strategy.productGoals],
              ["Scope", input?.scope.mustHave],
              [
                "Quality recommendations",
                review?.recommendations.join("\n") ||
                  "Run a quality review to see recommendations."
              ]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border bg-background p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  {value || "Not supplied"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
