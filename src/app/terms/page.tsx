import { Logo } from "@/components/layout/logo";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Logo />
      <h1 className="mt-10 text-3xl font-semibold">Terms</h1>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        PRD Forge is provided as a product requirements workspace. Demo content
        is illustrative. Users are responsible for validating AI-generated
        assumptions, legal claims, launch metrics, and external research before
        relying on a PRD for delivery decisions.
      </p>
    </main>
  );
}
