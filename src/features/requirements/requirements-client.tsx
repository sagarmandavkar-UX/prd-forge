"use client";

import { Download, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, EmptyState } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProjectNav } from "@/features/projects/project-nav";
import {
  buildExportFileName,
  formatRequirementsCsv
} from "@/lib/exports/formatters";
import { findDuplicateRequirements } from "@/lib/quality/review";
import { analytics } from "@/lib/analytics/events";
import { useDemoStore, useProject } from "@/providers/demo-store-provider";
import type {
  Requirement,
  RequirementPriority,
  RequirementStatus
} from "@/types/prd";

type RequirementFilter = "all" | "functional" | "non-functional";

export function RequirementsClient({ projectId }: { projectId: string }) {
  const { project, requirements, userStories } = useProject(projectId);
  const {
    addRequirement,
    updateRequirement,
    deleteRequirement,
    bulkUpdateRequirements
  } = useDemoStore();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<RequirementFilter>("all");
  const [priority, setPriority] = useState<RequirementPriority | "all">("all");
  const [status, setStatus] = useState<RequirementStatus | "all">("all");
  const [sort, setSort] = useState("code");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  const filtered = useMemo(() => {
    return [...requirements]
      .filter((requirement) => {
        const text =
          `${requirement.requirementCode} ${requirement.title} ${requirement.description}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          (type === "all" || requirement.requirementType === type) &&
          (priority === "all" || requirement.priority === priority) &&
          (status === "all" || requirement.status === status)
        );
      })
      .sort((a, b) => {
        if (sort === "priority") return a.priority.localeCompare(b.priority);
        if (sort === "status") return a.status.localeCompare(b.status);
        if (sort === "updated") return b.updatedAt.localeCompare(a.updatedAt);
        return a.requirementCode.localeCompare(b.requirementCode);
      });
  }, [priority, query, requirements, sort, status, type]);

  const duplicates = findDuplicateRequirements(requirements).flat();
  const active =
    requirements.find((requirement) => requirement.id === activeId) ??
    filtered[0];

  function toggleSelected(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function downloadCsv() {
    const blob = new Blob([formatRequirementsCsv(requirements)], {
      type: "text/csv;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = buildExportFileName(
      `${project?.name ?? "requirements"} requirements`,
      "csv"
    );
    anchor.click();
    URL.revokeObjectURL(url);
    analytics.track("export_completed", { format: "csv" });
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
      title="Requirements"
      description="Search, edit, bulk update, and export functional and non-functional requirements."
      actions={
        <Button
          onClick={() => {
            addRequirement(projectId);
            analytics.track("requirement_added");
          }}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add requirement
        </Button>
      }
    >
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_360px] sm:p-6">
        <section className="min-w-0 rounded-lg border bg-card">
          <div className="flex flex-col gap-3 border-b p-4 xl:flex-row xl:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search requirements</span>
              <Search
                className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search requirements..."
                className="pl-9"
              />
            </label>
            <Select
              value={type}
              onChange={(event) =>
                setType(event.target.value as RequirementFilter)
              }
              className="xl:w-44"
            >
              <option value="all">Type: All</option>
              <option value="functional">Functional</option>
              <option value="non-functional">Non-functional</option>
            </Select>
            <Select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as RequirementStatus | "all")
              }
              className="xl:w-44"
            >
              <option value="all">Status: All</option>
              <option>Draft</option>
              <option>Ready for review</option>
              <option>Approved</option>
              <option>In development</option>
              <option>Completed</option>
              <option>Deferred</option>
            </Select>
            <Select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as RequirementPriority | "all")
              }
              className="xl:w-44"
            >
              <option value="all">Priority: All</option>
              <option>Must have</option>
              <option>Should have</option>
              <option>Could have</option>
              <option value="Won't have now">Won&apos;t have now</option>
            </Select>
            <Select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="xl:w-44"
            >
              <option value="code">Sort: ID</option>
              <option value="updated">Updated</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </Select>
          </div>

          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedIds.length} selected · {filtered.length} shown
              {duplicates.length
                ? ` · ${duplicates.length} possible duplicates`
                : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              <Select
                aria-label="Bulk priority"
                className="w-44"
                onChange={(event) => {
                  if (event.target.value)
                    bulkUpdateRequirements(projectId, selectedIds, {
                      priority: event.target.value as RequirementPriority
                    });
                }}
                defaultValue=""
              >
                <option value="">Bulk priority</option>
                <option>Must have</option>
                <option>Should have</option>
                <option>Could have</option>
                <option value="Won't have now">Won&apos;t have now</option>
              </Select>
              <Select
                aria-label="Bulk status"
                className="w-44"
                onChange={(event) => {
                  if (event.target.value)
                    bulkUpdateRequirements(projectId, selectedIds, {
                      status: event.target.value as RequirementStatus
                    });
                }}
                defaultValue=""
              >
                <option value="">Bulk status</option>
                <option>Draft</option>
                <option>Ready for review</option>
                <option>Approved</option>
                <option>In development</option>
                <option>Completed</option>
                <option>Deferred</option>
              </Select>
              <Button type="button" variant="outline" onClick={downloadCsv}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Export CSV
              </Button>
            </div>
          </div>

          {filtered.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-muted text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((requirement) => (
                    <tr
                      key={requirement.id}
                      className={`border-t hover:bg-accent/40 ${active?.id === requirement.id ? "bg-accent/60" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-input"
                          checked={selectedIds.includes(requirement.id)}
                          onChange={() => toggleSelected(requirement.id)}
                          aria-label={`Select ${requirement.requirementCode}`}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-muted-foreground">
                        {requirement.requirementCode}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="text-left font-medium hover:text-primary"
                          onClick={() => setActiveId(requirement.id)}
                        >
                          {requirement.title}
                        </button>
                        {duplicates.some(
                          (item) => item.id === requirement.id
                        ) ? (
                          <Badge tone="yellow" className="ml-2">
                            duplicate?
                          </Badge>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          tone={
                            requirement.requirementType === "functional"
                              ? "blue"
                              : "purple"
                          }
                        >
                          {requirement.requirementType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{requirement.priority}</td>
                      <td className="px-4 py-3">{requirement.status}</td>
                      <td className="px-4 py-3">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label="Delete requirement"
                          onClick={() =>
                            deleteRequirement(projectId, requirement.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4">
              <EmptyState
                title="No requirements match"
                description="Change filters or add a requirement to this PRD."
                action={
                  <Button onClick={() => addRequirement(projectId)}>
                    Add requirement
                  </Button>
                }
              />
            </div>
          )}
        </section>

        <RequirementDrawer
          requirement={active}
          userStoryCount={userStories.length}
          onChange={(patch) =>
            active && updateRequirement(projectId, active.id, patch)
          }
        />
      </div>
    </AppShell>
  );
}

function RequirementDrawer({
  requirement,
  userStoryCount,
  onChange
}: {
  requirement?: Requirement;
  userStoryCount: number;
  onChange: (patch: Partial<Requirement>) => void;
}) {
  if (!requirement) {
    return (
      <EmptyState
        title="No requirement selected"
        description="Select a row to edit details and acceptance criteria."
      />
    );
  }

  return (
    <aside className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {requirement.requirementCode}
          </p>
          <h2 className="mt-1 text-lg font-semibold">Requirement details</h2>
        </div>
        <Badge
          tone={
            requirement.requirementType === "functional" ? "blue" : "purple"
          }
        >
          {requirement.requirementType}
        </Badge>
      </div>
      <div className="mt-5 space-y-4">
        <label className="block text-sm font-medium">
          Title
          <Input
            className="mt-2"
            value={requirement.title}
            onChange={(event) => onChange({ title: event.target.value })}
          />
        </label>
        <label className="block text-sm font-medium">
          Description
          <Textarea
            className="mt-2"
            value={requirement.description}
            onChange={(event) => onChange({ description: event.target.value })}
            rows={5}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Priority
            <Select
              className="mt-2"
              value={requirement.priority}
              onChange={(event) =>
                onChange({
                  priority: event.target.value as RequirementPriority
                })
              }
            >
              <option>Must have</option>
              <option>Should have</option>
              <option>Could have</option>
              <option value="Won't have now">Won&apos;t have now</option>
            </Select>
          </label>
          <label className="block text-sm font-medium">
            Status
            <Select
              className="mt-2"
              value={requirement.status}
              onChange={(event) =>
                onChange({ status: event.target.value as RequirementStatus })
              }
            >
              <option>Draft</option>
              <option>Ready for review</option>
              <option>Approved</option>
              <option>In development</option>
              <option>Completed</option>
              <option>Deferred</option>
            </Select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          Related goal
          <Input
            className="mt-2"
            value={requirement.relatedGoal}
            onChange={(event) => onChange({ relatedGoal: event.target.value })}
          />
        </label>
        <label className="block text-sm font-medium">
          Related persona
          <Input
            className="mt-2"
            value={requirement.relatedPersona}
            onChange={(event) =>
              onChange({ relatedPersona: event.target.value })
            }
          />
        </label>
        <label className="block text-sm font-medium">
          Acceptance criteria
          <Textarea
            className="mt-2"
            value={requirement.acceptanceCriteria.join("\n")}
            onChange={(event) =>
              onChange({
                acceptanceCriteria: event.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
              })
            }
            rows={6}
          />
        </label>
        <div className="rounded-lg border bg-background p-3 text-sm">
          <p className="font-medium">Links</p>
          <p className="mt-1 text-muted-foreground">
            Related stories in this project: {userStoryCount}. Requirement links
            are stored by ID for production schema compatibility.
          </p>
        </div>
      </div>
    </aside>
  );
}
