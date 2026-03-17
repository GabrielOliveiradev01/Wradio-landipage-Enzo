import { createMiddleware } from "hono/factory";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.js";

export type Variables = {
  user: User;
};

export const authMiddleware = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "Não autorizado" }, 401);
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return c.json({ error: "Token inválido" }, 401);
    }

    c.set("user", user);
    await next();
  }
);
