import { RequirementsClient } from "@/features/requirements/requirements-client";

export default async function RequirementsPage({
  params
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <RequirementsClient projectId={projectId} />;
}
