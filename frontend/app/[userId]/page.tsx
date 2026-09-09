import PublicProfile from "@/app/components/organisms/PublicProfile";

export default async function SharedProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <PublicProfile userId={userId} />;
}
