import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@/db/schema";
import getEnvConfig from "@/lib/env-config";

const db = drizzle({
  connection: getEnvConfig().database.url,
  casing: "snake_case",
  schema,
});

export default db;
