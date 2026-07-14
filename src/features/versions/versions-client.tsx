"use client";

import { GitCompareArrows, RotateCcw, Save } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, EmptyState } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProjectNav } from "@/features/projects/project-nav";
import { compareVersions } from "@/lib/versions/diff";
import { analytics } from "@/lib/analytics/events";
import { useDemoStore, useProject } from "@/providers/demo-store-provider";

export function VersionsClient({ projectId }: { projectId: string }) {
  const { project, versions, prd } = useProject(projectId);
  const { createVersion, restoreVersion } = useDemoStore();
  const [versionName, setVersionName] = useState("");
  const [changeNote, setChangeNote] = useState("");
  const [firstId, setFirstId] = useState("");
  const [secondId, setSecondId] = useState("");

  const first =
    versions.find((version) => version.id === firstId) ?? versions[0];
  const second =
    versions.find((version) => version.id === secondId) ??
    versions[versions.length - 1];
  const diffs = useMemo(
    () =>
      first && second
        ? compareVersions(first, second).filter((diff) => diff.changed)
        : [],
    [first, second]
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

  return (
    <AppShell
      aside={<ProjectNav projectId={projectId} />}
      title="Version history"
      description="Create named snapshots, compare section-level changes, and restore older versions."
    >
      <div className="grid gap-4 p-4 lg:grid-cols-[360px_minmax(0,1fr)] sm:p-6">
        <section className="space-y-4">
          <Card className="p-5">
            <h2 className="font-semibold">Create named version</h2>
            <label className="mt-4 block text-sm font-medium">
              Version name
              <Input
                className="mt-2"
                value={versionName}
                onChange={(event) => setVersionName(event.target.value)}
              />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Change note
              <Textarea
                className="mt-2"
                value={changeNote}
                onChange={(event) => setChangeNote(event.target.value)}
                rows={4}
              />
            </label>
            <Button
              type="button"
              className="mt-4 w-full"
              disabled={!prd}
              onClick={() => {
                createVersion(
                  projectId,
                  versionName || `Snapshot ${versions.length + 1}`,
                  changeNote || "Manual snapshot"
                );
                analytics.track("version_created");
                setVersionName("");
                setChangeNote("");
              }}
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              Save version
            </Button>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold">Versions</h2>
            <div className="mt-4 space-y-3">
              {versions.map((version) => (
                <article
                  key={version.id}
                  className="rounded-lg border bg-background p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        v{version.versionNumber}: {version.versionName}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(version.createdAt).toLocaleString()} ·{" "}
                        {version.changeNote}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => restoreVersion(projectId, version.id)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      Restore
                    </Button>
                  </div>
                </article>
              ))}
              {!versions.length ? (
                <p className="text-sm text-muted-foreground">
                  No named versions yet.
                </p>
              ) : null}
            </div>
          </Card>
        </section>

        <section className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-2">
            <GitCompareArrows
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            />
            <h2 className="font-semibold">Compare versions</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium">
              From
              <select
                className="focus-ring mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={first?.id ?? ""}
                onChange={(event) => setFirstId(event.target.value)}
              >
                {versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    v{version.versionNumber}: {version.versionName}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              To
              <select
                className="focus-ring mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={second?.id ?? ""}
                onChange={(event) => setSecondId(event.target.value)}
              >
                {versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    v{version.versionNumber}: {version.versionName}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-5 space-y-4">
            {diffs.length ? (
              diffs.slice(0, 8).map((diff) => (
                <article
                  key={diff.sectionKey}
                  className="rounded-lg border bg-background p-4"
                >
                  <h3 className="font-medium">{diff.title}</h3>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        Before
                      </p>
                      <p className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-md border bg-card p-3 text-sm leading-6">
                        {diff.before || "Empty"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        After
                      </p>
                      <p className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-md border bg-card p-3 text-sm leading-6">
                        {diff.after || "Empty"}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState
                title="No differences selected"
                description="Create at least two versions or select two different snapshots to compare section-level changes."
              />
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
