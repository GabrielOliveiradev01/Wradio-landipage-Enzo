import { Hono } from "hono";
import type { Variables } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";

export const usersRouter = new Hono<{ Variables: Variables }>();

/** GET /api/users/me — retorna perfil do usuário autenticado */
usersRouter.get("/me", async (c) => {
  const user = c.get("user");

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return c.json({ error: "Perfil não encontrado" }, 404);
  }

  return c.json({ user: { id: user.id, email: user.email }, profile });
});

/** PATCH /api/users/me — atualiza perfil */
usersRouter.patch("/me", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{
    full_name?: string | null;
    crm?: string | null;
    specialty?: string | null;
    avatar_url?: string | null;
  }>();

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return c.json({ error: "Falha ao atualizar perfil" }, 400);
  }

  return c.json({ profile });
});
