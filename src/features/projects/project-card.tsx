"use client";

import Link from "next/link";
import { Archive, Copy, MoreVertical, RotateCcw, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { Project } from "@/types/prd";

function statusTone(status: Project["status"]) {
  if (status === "completed") return "green";
  if (status === "active") return "blue";
  if (status === "archived") return "neutral";
  return "yellow";
}

export function ProjectCard({
  project,
  quality,
  requirements,
  owner,
  onDuplicate,
  onArchive,
  onRestore,
  onDelete,
  compact = false
}: {
  project: Project;
  quality: number;
  requirements: number;
  owner: string;
  onDuplicate: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
  compact?: boolean;
}) {
  return (
    <Card className={cn("group overflow-hidden", compact && "shadow-none")}>
      <Link
        href={`/projects/${project.id}`}
        className="block p-5 hover:bg-accent/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold">
                {project.name}
              </h3>
              <Badge tone={statusTone(project.status)}>{project.status}</Badge>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {project.description}
            </p>
          </div>
          <MoreVertical
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Updated</dt>
            <dd className="mt-1 font-medium">
              {new Date(project.updatedAt).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Quality</dt>
            <dd className="mt-1 font-medium">{quality || "No score"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Requirements</dt>
            <dd className="mt-1 font-medium">{requirements}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Owner</dt>
            <dd className="mt-1 truncate font-medium">{owner}</dd>
          </div>
        </dl>
      </Link>
      <div className="flex flex-wrap gap-2 border-t bg-background px-4 py-3">
        <Button type="button" variant="outline" size="sm" onClick={onDuplicate}>
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          Duplicate
        </Button>
        {project.status === "archived" ? (
          <Button type="button" variant="outline" size="sm" onClick={onRestore}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Restore
          </Button>
        ) : (
          <Button type="button" variant="outline" size="sm" onClick={onArchive}>
            <Archive className="h-3.5 w-3.5" aria-hidden="true" />
            Archive
          </Button>
        )}
        <Button type="button" variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
