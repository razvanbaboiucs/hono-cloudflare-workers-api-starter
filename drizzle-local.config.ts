import { defineConfig } from "drizzle-kit";

// Drizzle config for local development, to have access to drizzle studio
export default defineConfig({
  dialect: "sqlite",
  out: "./drizzle/migrations",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    // change to your local db path
    url: `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/f39a7da7cde7c42d6e7bd833ce7c290c1ecff8726303e7bf15774df7b1ab5634.sqlite`,
  }
});
