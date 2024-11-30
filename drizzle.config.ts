import { defineConfig } from "drizzle-kit";

// Drizzle config for Develop and Production stages. The db connection is handled by Cloudflare Workers.
export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  out: "./drizzle/migrations",
  schema: "./src/db/schema.ts",
});
