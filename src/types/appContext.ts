import { Context } from "hono";

export type AppContext = Context<{Bindings: Env}>