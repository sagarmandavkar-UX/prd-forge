"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="max-w-lg rounded-lg border bg-card p-8 shadow-soft">
        <p className="text-sm font-medium text-destructive">
          Something went wrong
        </p>
        <h1 className="mt-2 text-2xl font-semibold">
          PRD Forge hit a recoverable error.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </section>
    </main>
  );
}
