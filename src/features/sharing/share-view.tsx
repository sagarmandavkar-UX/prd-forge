"use client";

import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDemoStore } from "@/providers/demo-store-provider";

export function ShareView({ token }: { token: string }) {
  const { state } = useDemoStore();
  const shareLink = state.shareLinks.find((link) => link.token === token);
  const project = shareLink
    ? state.projects.find((item) => item.id === shareLink.projectId)
    : undefined;
  const prd = project ? state.prds[project.id] : undefined;

  if (!shareLink || !shareLink.isActive || !project || !prd) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <Card className="max-w-lg p-8 text-center">
          <Logo />
          <h1 className="mt-8 text-2xl font-semibold">
            Share link unavailable
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This link is invalid, expired, revoked, or only exists in another
            demo browser session.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Back to PRD Forge</Link>
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Logo />
          <Badge tone="blue">Read-only share</Badge>
        </div>
      </header>
      <article className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-semibold">{prd.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Shared from demo mode. Last edited{" "}
          {new Date(prd.updatedAt).toLocaleString()}.
        </p>
        {project.name.includes("Clinical") ? (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            This concept is not medical advice and is for simulated reasoning
            review only.
          </div>
        ) : null}
        <div className="mt-8 space-y-6">
          {prd.sections
            .filter((section) => section.isVisible)
            .sort((a, b) => a.position - b.position)
            .map((section, index) => (
              <section
                key={section.id}
                className="rounded-lg border bg-card p-5"
              >
                <h2 className="text-xl font-semibold">
                  {index + 1}. {section.title}
                </h2>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                  {section.contentText}
                </p>
              </section>
            ))}
        </div>
      </article>
    </main>
  );
}
