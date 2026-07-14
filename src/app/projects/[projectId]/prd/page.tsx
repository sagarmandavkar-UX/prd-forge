import { PrdEditorClient } from "@/features/prd/prd-editor-client";

export default async function PrdPage({
  params
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <PrdEditorClient projectId={projectId} />;
}
