"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Download,
  EyeOff,
  FileText,
  GitCompareArrows,
  Plus,
  Share2,
  Sparkles,
  Undo2
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, EmptyState } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ProjectNav } from "@/features/projects/project-nav";
import { RichTextEditor } from "@/features/prd/rich-text-editor";
import { buildExportFileName, formatMarkdown } from "@/lib/exports/formatters";
import { analytics } from "@/lib/analytics/events";
import { useDemoStore, useProject } from "@/providers/demo-store-provider";

const aiActions = [
  "Regenerate",
  "Shorten",
  "Expand",
  "Improve clarity",
  "Make more specific",
  "Add measurable outcomes",
  "Find missing details",
  "Find conflicting statements",
  "Add risks",
  "Add edge cases",
  "Rewrite for executives",
  "Rewrite for engineering"
];

export function PrdEditorClient({ projectId }: { projectId: string }) {
  const {
    updateSection,
    improveSection,
    restoreSection,
    hideSection,
    showSection,
    addCustomSection,
    reorderSection,
    runQualityReview,
    createVersion,
    createShareLink,
    revokeShareLink
  } = useDemoStore();
  const { project, prd, requirements, userStories, review, shareLinks } =
    useProject(projectId);
  const [selectedSectionId, setSelectedSectionId] = useState(
    prd?.sections[1]?.id ?? ""
  );
  const [draft, setDraft] = useState("");
  const [saveState, setSaveState] = useState("Saved");
  const [preview, setPreview] = useState<{
    action: string;
    content: string;
  } | null>(null);
  const [versionName, setVersionName] = useState("");
  const [dragging, setDragging] = useState("");

  const selectedSection = useMemo(
    () =>
      prd?.sections.find((section) => section.id === selectedSectionId) ??
      prd?.sections.find((section) => section.isVisible),
    [prd?.sections, selectedSectionId]
  );

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

  if (!prd) {
    return (
      <AppShell
        aside={<ProjectNav projectId={projectId} />}
        title="PRD editor"
        description={project.name}
      >
        <div className="p-6">
          <EmptyState
            icon={FileText}
            title="Generate the first PRD"
            description="Complete discovery and generate a schema-valid draft before editing sections."
            action={
              <Button asChild>
                <Link href={`/projects/${projectId}/discovery`}>
                  Go to discovery
                </Link>
              </Button>
            }
          />
        </div>
      </AppShell>
    );
  }

  const visibleSections = [...prd.sections]
    .sort((a, b) => a.position - b.position)
    .filter((section) => section.isVisible);
  const hiddenSections = prd.sections.filter((section) => !section.isVisible);
  const activeShare = shareLinks.find((link) => link.isActive);
  const shareOrigin =
    typeof window === "undefined" ? "" : window.location.origin;

  function saveContent(content = draft || selectedSection?.contentText || "") {
    if (!selectedSection) return;
    updateSection(projectId, selectedSection.id, content);
    setDraft(content);
    setSaveState(
      `Last saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    );
    analytics.track("section_edited");
  }

  async function runAiAction(action: string) {
    if (!selectedSection) return;
    if (
      action === "Regenerate" &&
      !window.confirm(
        "Preview a regenerated version before replacing this section?"
      )
    ) {
      return;
    }
    const content = await improveSection(projectId, selectedSection.id, action);
    setPreview({ action, content });
  }

  async function exportFormat(
    format: "markdown" | "text" | "json" | "pdf" | "docx" | "csv"
  ) {
    if (
      format === "markdown" &&
      typeof navigator !== "undefined" &&
      "clipboard" in navigator
    ) {
      await navigator.clipboard.writeText(
        formatMarkdown(prd, requirements, userStories)
      );
    }

    const response = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format, prd, requirements, userStories })
    });
    if (!response.ok) {
      window.alert("Export failed. Try another format or run the app again.");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = buildExportFileName(
      prd.title,
      format === "markdown" ? "md" : format
    );
    anchor.click();
    URL.revokeObjectURL(url);
    analytics.track("export_completed", { format });
  }

  return (
    <AppShell
      aside={<ProjectNav projectId={projectId} />}
      title={prd.title}
      description={`${saveState} · ${prd.sections.length} sections · ${requirements.length} requirements`}
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => exportFormat("markdown")}
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            Copy Markdown
          </Button>
          <Button type="button" onClick={() => exportFormat("pdf")}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export
          </Button>
        </>
      }
    >
      <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <aside className="border-b bg-card p-4 xl:border-b-0 xl:border-r">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              Document outline
            </h2>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Add custom section"
              onClick={() => {
                const title = window.prompt("Section title");
                if (title) addCustomSection(projectId, title);
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <ol className="mt-4 space-y-2">
            {visibleSections.map((section, index) => (
              <li
                key={section.id}
                draggable
                onDragStart={() => setDragging(section.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  reorderSection(projectId, dragging, section.id);
                  setDragging("");
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSectionId(section.id);
                    setDraft(section.contentText);
                  }}
                  className={`focus-ring w-full rounded-md border px-3 py-2 text-left text-sm ${
                    selectedSection?.id === section.id
                      ? "border-primary bg-accent text-accent-foreground"
                      : "bg-background"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium">
                      {index + 1}. {section.title}
                    </span>
                    <span className="text-xs">{section.score}</span>
                  </span>
                </button>
                <div className="mt-1 flex gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Move up"
                    onClick={() =>
                      index > 0 &&
                      reorderSection(
                        projectId,
                        section.id,
                        visibleSections[index - 1].id
                      )
                    }
                  >
                    <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Move down"
                    onClick={() =>
                      visibleSections[index + 1] &&
                      reorderSection(
                        projectId,
                        section.id,
                        visibleSections[index + 1].id
                      )
                    }
                  >
                    <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Hide section"
                    onClick={() => hideSection(projectId, section.id)}
                  >
                    <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </li>
            ))}
          </ol>
          {hiddenSections.length ? (
            <div className="mt-5 rounded-lg border bg-background p-3">
              <p className="text-sm font-medium">Hidden sections</p>
              <div className="mt-2 space-y-2">
                {hiddenSections.map((section) => (
                  <Button
                    key={section.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => showSection(projectId, section.id)}
                  >
                    Restore {section.title}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
        </aside>

        <section className="min-w-0 p-4 sm:p-6">
          {selectedSection ? (
            <div>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">
                    {selectedSection.title}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Autosave status: {saveState}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => restoreSection(projectId, selectedSection.id)}
                >
                  <Undo2 className="h-4 w-4" aria-hidden="true" />
                  Restore previous
                </Button>
              </div>
              <RichTextEditor
                value={draft || selectedSection.contentText}
                onChange={(value) => {
                  setDraft(value);
                  setSaveState("Unsaved changes");
                }}
                onSave={() => saveContent()}
              />
            </div>
          ) : null}
        </section>

        <aside className="space-y-4 border-t bg-card p-4 xl:border-l xl:border-t-0">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Quality</h2>
              <Badge tone={prd.overallScore >= 80 ? "green" : "yellow"}>
                {review?.overallScore ?? prd.overallScore}/100
              </Badge>
            </div>
            <Progress
              value={review?.overallScore ?? prd.overallScore}
              className="mt-4"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={() => runQualityReview(projectId)}
            >
              Run quality review
            </Button>
            <div className="mt-4 space-y-2">
              {Object.entries(review?.categoryScores ?? {})
                .slice(0, 5)
                .map(([label, score]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{label}</span>
                      <span>{score}</span>
                    </div>
                    <Progress value={score} />
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold">AI actions</h2>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {aiActions.map((action) => (
                <Button
                  key={action}
                  type="button"
                  size="sm"
                  variant="outline"
                  className="justify-start"
                  onClick={() => runAiAction(action)}
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  {action}
                </Button>
              ))}
            </div>
          </Card>

          {preview && selectedSection ? (
            <Card className="p-4">
              <h2 className="font-semibold">Preview: {preview.action}</h2>
              <label className="mt-3 block text-xs font-medium text-muted-foreground">
                Proposed replacement
                <Textarea
                  className="mt-2"
                  value={preview.content}
                  onChange={(event) =>
                    setPreview({ ...preview, content: event.target.value })
                  }
                  rows={8}
                />
              </label>
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    updateSection(
                      projectId,
                      selectedSection.id,
                      preview.content
                    );
                    setDraft(preview.content);
                    setPreview(null);
                    analytics.track("section_regenerated");
                  }}
                >
                  Apply
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setPreview(null)}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          ) : null}

          <Card className="p-4">
            <h2 className="font-semibold">Exports</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(
                ["markdown", "text", "json", "pdf", "docx", "csv"] as const
              ).map((format) => (
                <Button
                  key={format}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => exportFormat(format)}
                >
                  {format.toUpperCase()}
                </Button>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => window.print()}
            >
              Printer-friendly view
            </Button>
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold">Sharing</h2>
            {activeShare ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-emerald-700">Link is active</p>
                <Input
                  readOnly
                  value={`${shareOrigin}/share/${activeShare.token}`}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${shareOrigin}/share/${activeShare.token}`
                      )
                    }
                  >
                    Copy link
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => revokeShareLink(activeShare.id)}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                className="mt-3 w-full"
                onClick={() => {
                  createShareLink(projectId);
                  analytics.track("share_link_created");
                }}
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Create share link
              </Button>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold">Version</h2>
            <Input
              className="mt-3"
              value={versionName}
              onChange={(event) => setVersionName(event.target.value)}
              placeholder="Version name"
            />
            <Button
              type="button"
              className="mt-3 w-full"
              onClick={() => {
                createVersion(
                  projectId,
                  versionName || `Version ${new Date().toLocaleDateString()}`,
                  "Saved from editor"
                );
                analytics.track("version_created");
                setVersionName("");
              }}
            >
              <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
              Create version
            </Button>
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold">Issues</h2>
            <div className="mt-3 space-y-2">
              {(review?.issues ?? []).slice(0, 5).map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  className="focus-ring w-full rounded-md border bg-background p-3 text-left text-sm hover:bg-accent"
                  onClick={() => {
                    const target = prd.sections.find(
                      (section) => section.sectionKey === issue.sectionKey
                    );
                    if (target) {
                      setSelectedSectionId(target.id);
                      setDraft(target.contentText);
                    }
                  }}
                >
                  <span className="font-medium">{issue.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {issue.description}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
