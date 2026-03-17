import { createClient } from "@/lib/supabase/server";
import { getCachedProfile, setCachedProfile } from "@/lib/profile-cache";
import DashboardShell from "./_components/DashboardShell";

async function fetchProfile(userId: string) {
  // 1. Tenta o cache primeiro
  const cached = await getCachedProfile(userId);
  if (cached) return cached;

  // 2. Cache miss — busca no Supabase e grava no cache
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", userId)
    .single();

  // `profiles` ainda não está nos tipos gerados — remover cast após `supabase gen types`
  const row = data as { full_name: string | null; avatar_url: string | null } | null;

  const profile = {
    fullName: row?.full_name ?? "",
    avatarUrl: row?.avatar_url ?? null,
  };

  await setCachedProfile(userId, profile);
  return profile;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await fetchProfile(user.id) : { fullName: "", avatarUrl: null };

  return (
    <DashboardShell
      initialFullName={profile.fullName}
      initialAvatarUrl={profile.avatarUrl}
    >
      {children}
    </DashboardShell>
  );
}
