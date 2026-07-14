"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  BookOpen,
  Copy,
  Download,
  FileArchive,
  FileText,
  Folder,
  Grid2X2,
  Home,
  List,
  MoreVertical,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SunMoon,
  Trash2
} from "lucide-react";
import { useMemo, useState } from "react";

import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  buildExportFileName,
  formatRequirementsCsv
} from "@/lib/exports/formatters";
import { analytics } from "@/lib/analytics/events";
import { cn } from "@/lib/utils/cn";
import { useDemoStore } from "@/providers/demo-store-provider";
import type {
  ProjectStatus,
  Requirement,
  RequirementPriority,
  RequirementStatus
} from "@/types/prd";

type SortKey = "updated-desc" | "updated-asc" | "name-asc" | "score-desc";
type RequirementFilter = "all" | "functional" | "non-functional";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/projects/new", label: "Projects", icon: Folder },
  { href: "/templates", label: "Templates", icon: FileText },
  {
    href: "/projects/project_campus/discovery",
    label: "AI Assistant",
    icon: Sparkles
  },
  {
    href: "/projects/project_campus/prd",
    label: "Quality Review",
    icon: ShieldCheck
  },
  {
    href: "/projects/project_campus/versions",
    label: "Export History",
    icon: FileArchive
  },
  { href: "/settings", label: "Settings", icon: Settings }
];

const owners = ["Alex Kim", "Jamie Lee", "Taylor Chen"];
const dashboardRequirementTitles = [
  "User registration with email",
  "Browse and search clubs",
  "Club details and leader contact",
  "Join / Request to join a club",
  "Event calendar view",
  "Push notifications for events"
];

function projectStatusTone(status: ProjectStatus) {
  if (status === "active" || status === "completed") return "green";
  if (status === "archived") return "neutral";
  return "yellow";
}

function projectStatusLabel(status: ProjectStatus) {
  if (status === "completed") return "Active";
  return status;
}

function priorityTone(priority: RequirementPriority) {
  if (priority === "Must have") return "red";
  if (priority === "Should have") return "yellow";
  return "green";
}

function priorityLabel(priority: RequirementPriority) {
  if (priority === "Must have") return "High";
  if (priority === "Should have") return "Medium";
  return "Low";
}

function requirementStatusTone(status: RequirementStatus) {
  if (status === "Approved" || status === "Completed") return "green";
  if (status === "Ready for review") return "yellow";
  if (status === "In development") return "blue";
  return "neutral";
}

function requirementStatusLabel(status: RequirementStatus) {
  if (status === "Ready for review") return "In Review";
  if (status === "In development") return "In Progress";
  if (status === "Draft") return "Not Started";
  return status;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function DashboardClient() {
  const router = useRouter();
  const { state, resetDemo } = useDemoStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [sort, setSort] = useState<SortKey>("updated-desc");
  const [view, setView] = useState<"list" | "grid">("list");
  const [selectedProjectId, setSelectedProjectId] = useState("project_campus");
  const [requirementQuery, setRequirementQuery] = useState("");
  const [requirementType, setRequirementType] =
    useState<RequirementFilter>("all");
  const [requirementStatus, setRequirementStatus] = useState<
    RequirementStatus | "all"
  >("all");
  const [requirementPriority, setRequirementPriority] = useState<
    RequirementPriority | "all"
  >("all");
  const [selectedRequirementIds, setSelectedRequirementIds] = useState([
    "req_campus_1",
    "req_campus_2"
  ]);

  const projects = useMemo(() => {
    return [...state.projects]
      .filter((project) => {
        const searchable =
          `${project.name} ${project.description} ${project.industry}`.toLowerCase();
        return (
          searchable.includes(query.toLowerCase()) &&
          (status === "all" || project.status === status)
        );
      })
      .sort((a, b) => {
        if (a.id === selectedProjectId) return -1;
        if (b.id === selectedProjectId) return 1;
        if (sort === "updated-asc")
          return a.updatedAt.localeCompare(b.updatedAt);
        if (sort === "name-asc") return a.name.localeCompare(b.name);
        if (sort === "score-desc") {
          return (
            (state.prds[b.id]?.overallScore ?? 0) -
            (state.prds[a.id]?.overallScore ?? 0)
          );
        }
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [query, selectedProjectId, sort, state.prds, state.projects, status]);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ??
    projects[0] ??
    state.projects[0];
  const selectedProjectRequirements = useMemo(
    () =>
      selectedProject ? (state.requirements[selectedProject.id] ?? []) : [],
    [selectedProject, state.requirements]
  );
  const prd = selectedProject ? state.prds[selectedProject.id] : undefined;
  const versions = selectedProject
    ? (state.versions[selectedProject.id] ?? [])
    : [];
  const currentVersion = versions[versions.length - 1];
  const activeShare = selectedProject
    ? state.shareLinks.find(
        (link) => link.projectId === selectedProject.id && link.isActive
      )
    : undefined;

  const filteredRequirements = useMemo(() => {
    return selectedProjectRequirements.filter((requirement) => {
      const searchable =
        `${requirement.requirementCode} ${requirement.title} ${requirement.description}`.toLowerCase();
      return (
        searchable.includes(requirementQuery.toLowerCase()) &&
        (requirementType === "all" ||
          requirement.requirementType === requirementType) &&
        (requirementStatus === "all" ||
          requirement.status === requirementStatus) &&
        (requirementPriority === "all" ||
          requirement.priority === requirementPriority)
      );
    });
  }, [
    requirementPriority,
    requirementQuery,
    requirementStatus,
    requirementType,
    selectedProjectRequirements
  ]);

  const selectedRows = selectedRequirementIds.filter((id) =>
    filteredRequirements.some((requirement) => requirement.id === id)
  );

  function toggleRequirement(id: string) {
    setSelectedRequirementIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function downloadCsv() {
    if (!selectedProject) return;
    const blob = new Blob(
      [formatRequirementsCsv(selectedProjectRequirements)],
      {
        type: "text/csv;charset=utf-8"
      }
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = buildExportFileName(
      `${selectedProject.name} requirements`,
      "csv"
    );
    anchor.click();
    URL.revokeObjectURL(url);
    analytics.track("export_completed", { format: "csv" });
  }

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Logo href="/" />
        <div className="mt-8 rounded-lg border bg-card p-8">
          <h1 className="text-xl font-semibold">No projects yet</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a PRD project to open the workspace.
          </p>
          <Button className="mt-5" asChild>
            <Link href="/projects/new">Create PRD</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-[15px]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="hidden border-r bg-card lg:flex lg:flex-col">
          <div className="border-b px-6 py-8">
            <Logo href="/dashboard" />
          </div>
          <nav className="flex-1 space-y-2 p-3" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.label === "Dashboard";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "focus-ring flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    active && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-4 border-t p-4">
            <div className="flex items-center justify-between rounded-lg border bg-background p-3">
              <div className="flex items-center gap-3 text-sm">
                <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                Demo Mode
              </div>
              <span className="h-5 w-9 rounded-full bg-primary p-0.5">
                <span className="block h-4 w-4 translate-x-4 rounded-full bg-white" />
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                AK
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{state.profile.fullName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {state.profile.email}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Account menu"
              >
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                resetDemo();
                router.push("/");
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Reset demo
            </Button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
            <div className="flex min-h-20 flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:px-5">
              <div className="flex items-center justify-between gap-3 lg:hidden">
                <Logo href="/dashboard" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Toggle appearance"
                >
                  <SunMoon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <Button asChild className="h-11 shrink-0 px-6">
                <Link href="/projects/new">
                  <Plus className="h-5 w-5" aria-hidden="true" />
                  Create PRD
                </Link>
              </Button>
              <label className="relative min-w-[220px] flex-1">
                <span className="sr-only">Search projects</span>
                <Search
                  className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search projects..."
                  className="h-11 pl-11"
                />
              </label>
              <Select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ProjectStatus | "all")
                }
                className="h-11 lg:w-36"
              >
                <option value="all">Status: All</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </Select>
              <Select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="h-11 lg:w-44"
              >
                <option value="updated-desc">Sort: Updated</option>
                <option value="updated-asc">Sort: Oldest</option>
                <option value="name-asc">Sort: Name</option>
                <option value="score-desc">Sort: Quality</option>
              </Select>
              <div className="hidden items-center gap-2 lg:flex">
                <div className="flex rounded-md border p-1">
                  <Button
                    type="button"
                    size="icon"
                    variant={view === "list" ? "secondary" : "ghost"}
                    aria-label="List view"
                    onClick={() => setView("list")}
                  >
                    <List className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant={view === "grid" ? "secondary" : "ghost"}
                    aria-label="Grid view"
                    onClick={() => setView("grid")}
                  >
                    <Grid2X2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Toggle appearance"
                >
                  <SunMoon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </header>

          <main
            id="main-content"
            className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-[328px_minmax(0,1fr)_258px]"
          >
            <section className="border-r bg-card">
              <div className="border-b px-5 py-5">
                <h1 className="text-base font-semibold">Your Projects</h1>
              </div>
              <div className="border-b px-5 py-3">
                <div className="grid grid-cols-[1fr_auto] text-sm text-muted-foreground">
                  <span>Project</span>
                  <span className="inline-flex items-center gap-1">
                    Updated{" "}
                    <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
              <div className="divide-y">
                {projects.map((project) => {
                  const active = project.id === selectedProject.id;
                  const quality = state.prds[project.id]?.overallScore;
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setSelectedProjectId(project.id)}
                      className={cn(
                        "flex w-full items-start gap-3 border-l-4 border-transparent px-5 py-5 text-left hover:bg-accent/50",
                        active && "border-primary bg-accent/55"
                      )}
                    >
                      <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <BookOpen className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold leading-5">
                          {project.name}
                        </span>
                        <span className="mt-2 inline-flex items-center gap-2">
                          <Badge tone={projectStatusTone(project.status)}>
                            {projectStatusLabel(project.status)}
                          </Badge>
                          {quality ? (
                            <span className="text-xs text-muted-foreground">
                              Quality {quality}
                            </span>
                          ) : null}
                        </span>
                        {project.id === "project_clinical" ? (
                          <span className="mt-2 block text-sm text-destructive">
                            Not medical advice
                          </span>
                        ) : null}
                        <span className="mt-2 block text-sm text-muted-foreground">
                          {formatDate(project.updatedAt)}
                        </span>
                      </span>
                      <MoreVertical
                        className="mt-4 h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
              <div className="border-t px-5 py-4 text-sm text-muted-foreground lg:absolute lg:bottom-0 lg:w-[328px] lg:bg-card">
                {projects.length} projects
              </div>
            </section>

            <section className="min-w-0 bg-background">
              <div className="border-b bg-card px-5 py-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <BookOpen className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          {selectedProject.name}
                        </h2>
                        <Badge tone={projectStatusTone(selectedProject.status)}>
                          {projectStatusLabel(selectedProject.status)}
                        </Badge>
                      </div>
                      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        {selectedProject.description}
                      </p>
                    </div>
                  </div>
                </div>
                <nav
                  className="mt-6 flex gap-6 overflow-x-auto text-sm"
                  aria-label="Project navigation"
                >
                  {[
                    [
                      "Requirements",
                      `/projects/${selectedProject.id}/requirements`,
                      true
                    ],
                    ["Overview", `/projects/${selectedProject.id}`],
                    ["Documents", `/projects/${selectedProject.id}/prd`],
                    ["AI Notes", `/projects/${selectedProject.id}/discovery`],
                    ["Activity", `/projects/${selectedProject.id}/versions`],
                    ["PRD editor", `/projects/${selectedProject.id}/prd`]
                  ].map(([label, href, active]) => (
                    <Link
                      key={label as string}
                      href={href as string}
                      className={cn(
                        "border-b-2 border-transparent px-1 pb-3 font-medium text-muted-foreground hover:text-foreground",
                        active && "border-primary text-primary"
                      )}
                    >
                      {label as string}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="space-y-4 p-4">
                <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 xl:flex-row xl:items-center">
                  <label className="relative flex-1">
                    <span className="sr-only">Search requirements</span>
                    <Search
                      className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      value={requirementQuery}
                      onChange={(event) =>
                        setRequirementQuery(event.target.value)
                      }
                      placeholder="Search requirements..."
                      className="pl-9"
                    />
                  </label>
                  <Select
                    value={requirementType}
                    onChange={(event) =>
                      setRequirementType(
                        event.target.value as RequirementFilter
                      )
                    }
                    className="xl:w-32"
                  >
                    <option value="all">Type: All</option>
                    <option value="functional">Functional</option>
                    <option value="non-functional">Non-functional</option>
                  </Select>
                  <Select
                    value={requirementStatus}
                    onChange={(event) =>
                      setRequirementStatus(
                        event.target.value as RequirementStatus | "all"
                      )
                    }
                    className="xl:w-36"
                  >
                    <option value="all">Status: All</option>
                    <option>Approved</option>
                    <option>Ready for review</option>
                    <option>In development</option>
                    <option>Draft</option>
                    <option>Completed</option>
                    <option>Deferred</option>
                  </Select>
                  <Select
                    value={requirementPriority}
                    onChange={(event) =>
                      setRequirementPriority(
                        event.target.value as RequirementPriority | "all"
                      )
                    }
                    className="xl:w-36"
                  >
                    <option value="all">Priority: All</option>
                    <option>Must have</option>
                    <option>Should have</option>
                    <option>Could have</option>
                    <option value="Won't have now">Won&apos;t have now</option>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Advanced filters"
                  >
                    <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>

                <div className="rounded-lg border bg-card">
                  <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {selectedRows.length}
                      </span>{" "}
                      selected
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Select
                        aria-label="Bulk actions"
                        className="w-36"
                        defaultValue=""
                      >
                        <option value="">Bulk actions</option>
                        <option>Approve</option>
                        <option>Move to draft</option>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRequirementIds([])}
                      >
                        Clear
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={downloadCsv}
                      >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-[13px]">
                      <thead className="bg-muted text-[11px] uppercase text-muted-foreground">
                        <tr>
                          <th className="w-9 px-3 py-3">
                            <span className="sr-only">Select</span>
                          </th>
                          <th className="px-2 py-3">ID</th>
                          <th className="px-3 py-3">Title</th>
                          <th className="px-2 py-3">Type</th>
                          <th className="px-2 py-3">Priority</th>
                          <th className="px-2 py-3">Status</th>
                          <th className="px-2 py-3">Owner</th>
                          <th className="px-2 py-3">Updated</th>
                          <th className="w-8 px-2 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequirements.map((requirement, index) => (
                          <RequirementRow
                            key={requirement.id}
                            requirement={requirement}
                            displayCode={`REQ-${String(index + 1).padStart(3, "0")}`}
                            displayTitle={
                              dashboardRequirementTitles[index] ??
                              requirement.title
                            }
                            owner={owners[index % owners.length]}
                            selected={selectedRequirementIds.includes(
                              requirement.id
                            )}
                            onToggle={() => toggleRequirement(requirement.id)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
                    <span>
                      Showing 1-{filteredRequirements.length} of{" "}
                      {selectedProjectRequirements.length} requirements
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Previous page"
                      >
                        <ArrowUpDown
                          className="h-4 w-4 rotate-90"
                          aria-hidden="true"
                        />
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        1
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Next page"
                      >
                        <ArrowUpDown
                          className="h-4 w-4 rotate-90"
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card px-5 py-4">
                  <div className="grid gap-4 md:grid-cols-5">
                    <QualityNote
                      icon={ShieldCheck}
                      title="Quality Review Highlights"
                      description="Completeness"
                    />
                    <QualityNote
                      title="Completeness"
                      description="All core sections are complete."
                    />
                    <QualityNote
                      title="Clarity"
                      description="Requirements are well-defined."
                    />
                    <QualityNote
                      title="Consistency"
                      description="No major issues detected."
                    />
                    <QualityNote
                      title="Testability"
                      description="2 requirements could be more testable."
                      warning
                    />
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-4 border-l bg-background p-4">
              <Panel title="Project Summary">
                <dl className="space-y-4 text-sm">
                  <SummaryRow label="Owner" value={state.profile.fullName} />
                  <SummaryRow
                    label="Created"
                    value={formatDate(selectedProject.createdAt)}
                  />
                  <SummaryRow
                    label="Last updated"
                    value={formatDate(selectedProject.updatedAt)}
                  />
                  <SummaryRow
                    label="Total requirements"
                    value={String(selectedProjectRequirements.length)}
                  />
                </dl>
                <div className="mt-5 border-t pt-5">
                  <p className="text-sm text-muted-foreground">Quality score</p>
                  <div className="mt-4 flex items-center gap-4">
                    <ScoreRing score={prd?.overallScore ?? 0} />
                    <div>
                      <p className="font-semibold text-emerald-700">Good</p>
                      <Link
                        href={`/projects/${selectedProject.id}/prd`}
                        className="text-sm font-medium text-primary"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel title="Version">
                <dl className="space-y-4 text-sm">
                  <SummaryRow
                    label="Current"
                    value={
                      currentVersion
                        ? `v${currentVersion.versionNumber}`
                        : "v1.0"
                    }
                  />
                  <SummaryRow
                    label="Updated"
                    value={formatDate(selectedProject.updatedAt)}
                  />
                </dl>
                <Button className="mt-5 w-full" variant="outline" asChild>
                  <Link href={`/projects/${selectedProject.id}/versions`}>
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    Create Version
                  </Link>
                </Button>
              </Panel>

              <Panel title="Share Link">
                <p className="text-sm text-emerald-700">
                  {activeShare ? "Link is active" : "No active link"}
                </p>
                <div className="mt-4 flex items-center rounded-md border bg-card">
                  <input
                    readOnly
                    value={
                      activeShare
                        ? `https://prdforge.demo/share/${activeShare.token}`
                        : "Create a share link in PRD editor"
                    }
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs text-muted-foreground outline-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Copy share link"
                  >
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                <Button
                  className="mt-4 w-full text-destructive"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Revoke Link
                </Button>
              </Panel>

              <Panel title="Export">
                <p className="text-sm text-muted-foreground">
                  Export PRD to share or store.
                </p>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={downloadCsv}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Export PRD
                </Button>
              </Panel>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}

function RequirementRow({
  requirement,
  displayCode,
  displayTitle,
  owner,
  selected,
  onToggle
}: {
  requirement: Requirement;
  displayCode: string;
  displayTitle: string;
  owner: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <tr className={cn("border-t", selected && "bg-accent/45")}>
      <td className="px-3 py-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-input accent-primary"
          checked={selected}
          onChange={onToggle}
          aria-label={`Select ${displayCode}`}
        />
      </td>
      <td className="whitespace-nowrap px-2 py-2 font-medium text-muted-foreground">
        {displayCode}
      </td>
      <td className="px-3 py-2 font-medium leading-5">
        <span className="line-clamp-2 max-w-[180px]">{displayTitle}</span>
      </td>
      <td className="whitespace-nowrap px-2 py-2">
        <Badge
          tone={
            requirement.requirementType === "functional" ? "blue" : "purple"
          }
        >
          {requirement.requirementType === "functional"
            ? "Functional"
            : "Non-Functional"}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-2 py-2">
        <Badge tone={priorityTone(requirement.priority)}>
          {priorityLabel(requirement.priority)}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-2 py-2">
        <Badge tone={requirementStatusTone(requirement.status)}>
          {requirementStatusLabel(requirement.status)}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">
        {owner}
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">
        {formatDate(requirement.updatedAt)}
      </td>
      <td className="px-2 py-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Requirement actions"
        >
          <MoreVertical className="h-4 w-4" aria-hidden="true" />
        </Button>
      </td>
    </tr>
  );
}

function Panel({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  return (
    <div
      className="flex h-20 w-20 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#2f9461 ${score * 3.6}deg, hsl(var(--muted)) 0deg)`
      }}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-2xl font-semibold text-emerald-700">
        {score || "--"}
      </div>
    </div>
  );
}

function QualityNote({
  icon: Icon,
  title,
  description,
  warning = false
}: {
  icon?: React.ElementType;
  title: string;
  description: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          warning
            ? "bg-amber-100 text-amber-700"
            : "bg-emerald-100 text-emerald-700"
        )}
      >
        {Icon ? (
          <Icon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-current" />
        )}
      </span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
