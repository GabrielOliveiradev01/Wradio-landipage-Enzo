import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

// Admin client — nunca expor no frontend
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: NextRequest) {
  const { email, password, full_name } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha obrigatórios" }, { status: 400 });
  }

  // Cria o usuário já confirmado — sem precisar de email de confirmação
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ user: data.user }, { status: 201 });
}
