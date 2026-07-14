import Link from "next/link";
import { FilePenLine } from "lucide-react";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="focus-ring inline-flex items-center gap-3 rounded-md"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
        <FilePenLine className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-xl font-semibold tracking-tight">PRD Forge</span>
    </Link>
  );
}
