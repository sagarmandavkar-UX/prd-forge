import { VersionsClient } from "@/features/versions/versions-client";

export default async function VersionsPage({
  params
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <VersionsClient projectId={projectId} />;
}
