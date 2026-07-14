import { ShareView } from "@/features/sharing/share-view";

export default async function SharePage({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ShareView token={token} />;
}
