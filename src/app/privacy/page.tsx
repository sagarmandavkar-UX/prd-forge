import { Logo } from "@/components/layout/logo";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Logo />
      <h1 className="mt-10 text-3xl font-semibold">Privacy</h1>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        PRD Forge demo mode stores sample content locally in the browser.
        Production deployments should use Supabase Row-Level Security, private
        projects by default, hashed share tokens, safe upload validation, and
        server-side AI keys. Analytics events intentionally avoid collecting
        document content.
      </p>
    </main>
  );
}
