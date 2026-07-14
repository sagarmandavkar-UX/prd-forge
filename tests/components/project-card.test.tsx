import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { ProjectCard } from "@/features/projects/project-card";
import { createInitialDemoState } from "@/lib/store/seed";

describe("ProjectCard", () => {
  it("renders project metadata and actions", async () => {
    const state = createInitialDemoState();
    const duplicate = vi.fn();
    render(
      React.createElement(ProjectCard, {
        project: state.projects[0],
        quality: 86,
        requirements: 6,
        owner: "Alex Kim",
        onDuplicate: duplicate,
        onArchive: vi.fn(),
        onRestore: vi.fn(),
        onDelete: vi.fn()
      })
    );

    expect(screen.getByText("Campus Club Application Hub")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /duplicate/i }));
    expect(duplicate).toHaveBeenCalledOnce();
  });
});
