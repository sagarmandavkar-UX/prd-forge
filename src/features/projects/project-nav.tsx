"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  GitCompareArrows,
  ListChecks,
  MessageSquareText,
  Settings2
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { useProject } from "@/providers/demo-store-provider";

const tabs = [
  { key: "overview", label: "Overview", icon: Settings2, path: "" },
  {
    key: "discovery",
    label: "Discovery",
    icon: MessageSquareText,
    path: "/discovery"
  },
  { key: "prd", label: "PRD editor", icon: FileText, path: "/prd" },
  {
    key: "requirements",
    label: "Requirements",
    icon: ListChecks,
    path: "/requirements"
  },
  {
    key: "versions",
    label: "Versions",
    icon: GitCompareArrows,
    path: "/versions"
  }
];

export function ProjectNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const { project, prd, requirements, questions } = useProject(projectId);

  return (
    <div className="sticky top-16 space-y-5 p-4">
      <div>
        <p className="text-xs font-medium uppercase text-muted-foreground">
          Project
        </p>
        <h2 className="mt-2 text-lg font-semibold">
          {project?.name ?? "Missing project"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {project?.description}
        </p>
        {project?.name.includes("Clinical") ? (
          <Badge tone="red" className="mt-3">
            Not medical advice
          </Badge>
        ) : null}
      </div>
      <nav className="space-y-1" aria-label="Project navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const href = `/projects/${projectId}${tab.path}`;
          const active = pathname === href;
          return (
            <Link
              key={tab.key}
              href={href}
              className={cn(
                "focus-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                active && "bg-accent text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <div className="rounded-lg border bg-background p-3 text-sm">
        <dl className="space-y-3">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Quality</dt>
            <dd className="font-medium">{prd?.overallScore ?? "Not scored"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Questions</dt>
            <dd className="font-medium">{questions.length}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Requirements</dt>
            <dd className="font-medium">{requirements.length}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
