import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authMiddleware } from "./middleware/auth.js";
import { usersRouter } from "./routes/users.js";

const app = new Hono();

app.use("*", logger());
app.use(
  "/api/*",
  cors({
    origin: process.env.WEB_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.get("/health", (c) => c.json({ status: "ok", app: "wradio-api" }));

// Rotas protegidas por JWT
app.use("/api/*", authMiddleware);
app.route("/api/users", usersRouter);

export default {
  port: Number(process.env.PORT) || 3001,
  fetch: app.fetch,
};
