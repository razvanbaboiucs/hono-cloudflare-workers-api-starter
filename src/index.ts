import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import auth from "./api/auth";
import users from "./api/users";
import { trimTrailingSlash } from "hono/trailing-slash";
import { requestId } from "hono/request-id";
import { csrf } from "hono/csrf";
import ai from "./api/ai";

const app = new Hono<{Bindings: Env}>();

// Global middlewares
app.use(logger());
app.use(
  cors({
    origin: (_, c) => c.env.CORS_ALLOWED_ORIGINS,
  })
);
app.use(csrf());
app.use(requestId({
  limitLength: 10,
}))
app.use(trimTrailingSlash());

// API routes
app.route("/api/v1/auth", auth);
app.route("/api/v1/users", users);
app.route("/api/v1/ai", ai);

export default app;
