import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { invalidateCachedProfile } from "@/lib/profile-cache";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  await invalidateCachedProfile(user.id);
  return NextResponse.json({ ok: true });
}
