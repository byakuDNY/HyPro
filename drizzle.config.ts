import { defineConfig } from "drizzle-kit";

import envConfig from "@/lib/env-config";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: envConfig.db.databaseUrl,
  },
  verbose: true,
  strict: true,
  casing: "snake_case",
});
