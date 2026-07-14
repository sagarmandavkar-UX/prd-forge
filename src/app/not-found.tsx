import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="max-w-lg rounded-lg border bg-card p-8 text-center shadow-soft">
        <p className="text-sm font-medium text-primary">Missing route</p>
        <h1 className="mt-2 text-2xl font-semibold">
          This PRD page does not exist.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The project may have been deleted, archived, or opened from an old
          link.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </section>
    </main>
  );
}
