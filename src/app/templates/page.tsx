import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { templates } from "@/features/templates/templates";

export default function TemplatesPage() {
  return (
    <AppShell
      title="Templates"
      description="Use focused PRD templates to adjust intake questions, sections, examples, and quality rules."
    >
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {templates.map((template) => (
          <Card key={template.key} className="p-5">
            <Badge tone="blue">{template.name}</Badge>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {template.description}
            </p>
            <div className="mt-5">
              <p className="text-sm font-medium">Recommended sections</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {template.recommendedSections.map((section) => (
                  <li key={section}>{section}</li>
                ))}
              </ul>
            </div>
            <div className="mt-5">
              <p className="text-sm font-medium">Quality rules</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {template.qualityRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
