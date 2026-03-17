import { createClient } from "@supabase/supabase-js";
import type { Database } from "@wradio/shared";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Client público — valida JWTs de usuários */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/** Client admin — operações server-side privilegiadas */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
