import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

export default function HelpPage() {
  return (
    <AppShell
      title="Help"
      description="Core workflows and local demo guidance."
    >
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        {[
          [
            "Create a PRD",
            "Start with New Project, complete the intake, answer discovery questions, and generate the PRD."
          ],
          [
            "Improve a section",
            "Open the PRD editor, choose a section, select an AI action, review the preview, and apply only after confirmation."
          ],
          [
            "Manage requirements",
            "Use the requirements workspace to filter, edit acceptance criteria, bulk update priority/status, and export CSV."
          ],
          [
            "Share safely",
            "Projects are private by default. Demo share links are local simulations; production stores hashed tokens."
          ]
        ].map(([title, copy]) => (
          <Card key={title} className="p-5">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {copy}
            </p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
