"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  GitCompareArrows,
  LockKeyhole,
  MessageSquareText,
  Sparkles
} from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDemoStore } from "@/providers/demo-store-provider";

const features = [
  "Guided project intake",
  "AI-generated discovery questions",
  "Structured PRD schema",
  "Editable document sections",
  "Requirements workspace",
  "Rule-based quality review",
  "Version comparison and restore",
  "Markdown, PDF, DOCX, JSON, text, and CSV exports",
  "Read-only share links"
];

export default function LandingPage() {
  const router = useRouter();
  const { enterDemoMode } = useDemoStore();

  function startDemo() {
    enterDemoMode();
    router.push("/dashboard");
  }

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo />
          <nav
            className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex"
            aria-label="Landing navigation"
          >
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#security" className="hover:text-foreground">
              Security
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Log in</Link>
            </Button>
            <Button onClick={startDemo}>Enter demo</Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Turn product ideas into clear, actionable requirements.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            PRD Forge helps product teams move from rough context to structured
            PRDs, linked requirements, quality checks, versions, exports, and
            read-only review links.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={startDemo}>
              Try demo mode
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/signup">Create account</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Demo mode works without Supabase or AI credentials and keeps sample
            data separate from production data.
          </p>
        </div>

        <ProductPreview />
      </section>

      <section id="how-it-works" className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            [
              "1",
              "Capture context",
              "Collect product basics, users, goals, scope, notes, and templates."
            ],
            [
              "2",
              "Ask sharper questions",
              "Generate follow-up questions that avoid already supplied information."
            ],
            [
              "3",
              "Draft and improve",
              "Create a schema-valid PRD, edit sections, and preview AI changes."
            ],
            [
              "4",
              "Review and share",
              "Score quality, manage versions, export, and share read-only links."
            ]
          ].map(([step, title, copy]) => (
            <div key={step} className="rounded-lg border bg-background p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                {step}
              </span>
              <h2 className="mt-4 text-base font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">
            A complete PRD workspace
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The product is built around actual document work: requirements, user
            stories, assumptions, quality review, versions, exports, and
            sharing.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 rounded-lg border bg-card p-4"
            >
              <CheckCircle2
                className="h-5 w-5 text-emerald-600"
                aria-hidden="true"
              />
              <span className="text-sm font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            [
              "Executive summary",
              "Summarizes the opportunity, users, scope, assumptions, and launch posture."
            ],
            [
              "Functional requirements",
              "Captures ID, priority, rationale, acceptance criteria, dependencies, and status."
            ],
            [
              "Quality review",
              "Flags vague language, missing metrics, privacy gaps, risks without mitigation, and duplicate requirements."
            ]
          ].map(([title, copy]) => (
            <Card key={title} className="p-6">
              <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {copy}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="security"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Private by default
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Production integrations are ready for Supabase Auth, PostgreSQL,
              Row-Level Security, hashed sharing tokens, safe uploads, and
              server-side AI keys. Demo mode stays local.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              [LockKeyhole, "RLS-ready schema"],
              [Sparkles, "Mock AI fallback"],
              [GitCompareArrows, "Version restore"]
            ].map(([Icon, label]) => (
              <div
                key={label as string}
                className="rounded-lg border bg-card p-5"
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <p className="mt-4 text-sm font-medium">{label as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-semibold">
              Build the next PRD from real context.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start in demo mode or connect Supabase and an AI provider.
            </p>
          </div>
          <Button size="lg" onClick={startDemo}>
            Open demo workspace
          </Button>
        </div>
      </section>

      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>PRD Forge</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/help" className="hover:text-foreground">
              Help
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ProductPreview() {
  return (
    <div className="rounded-lg border bg-card shadow-soft">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <p className="text-sm font-semibold">Campus Club Application Hub</p>
          <p className="text-xs text-muted-foreground">
            Requirements workspace
          </p>
        </div>
        <Badge tone="green">Quality 86</Badge>
      </div>
      <div className="grid min-h-[420px] grid-cols-[220px_1fr]">
        <aside className="border-r p-4">
          {[
            "Campus Club Application Hub",
            "Safe Clinical Reasoning Assistant",
            "Nonprofit Inventory Manager"
          ].map((project, index) => (
            <div
              key={project}
              className={`mb-3 rounded-lg border p-3 text-sm ${index === 0 ? "border-primary bg-accent text-accent-foreground" : "bg-background"}`}
            >
              <p className="font-medium">{project}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {index === 2 ? "Draft" : "Active"}
              </p>
            </div>
          ))}
        </aside>
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-10 flex-1 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
              Search requirements...
            </div>
            <Button variant="outline" size="sm">
              Status: All
            </Button>
            <Button variant="outline" size="sm">
              Export CSV
            </Button>
          </div>
          <div className="mt-5 overflow-hidden rounded-lg border">
            <div className="grid grid-cols-[90px_1fr_120px_120px] bg-muted px-4 py-3 text-xs font-medium text-muted-foreground">
              <span>ID</span>
              <span>Title</span>
              <span>Priority</span>
              <span>Status</span>
            </div>
            {[
              ["FR-001", "Browse and search clubs", "High", "Approved"],
              [
                "FR-002",
                "Submit standardized applications",
                "High",
                "In review"
              ],
              ["FR-003", "Track application status", "Medium", "Draft"]
            ].map((row) => (
              <div
                key={row[0]}
                className="grid grid-cols-[90px_1fr_120px_120px] border-t px-4 py-3 text-sm"
              >
                <span className="text-muted-foreground">{row[0]}</span>
                <span className="font-medium">{row[1]}</span>
                <span>{row[2]}</span>
                <span>{row[3]}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Quality Review Highlights
                </p>
                <p className="text-xs text-muted-foreground">
                  Completeness, clarity, consistency, testability
                </p>
              </div>
              <MessageSquareText
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
            </div>
            <Progress value={86} className="mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
