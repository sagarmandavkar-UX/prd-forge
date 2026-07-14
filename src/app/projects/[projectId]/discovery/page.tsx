import { DiscoveryClient } from "@/features/discovery/discovery-client";

export default async function DiscoveryPage({
  params
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <DiscoveryClient projectId={projectId} />;
}
