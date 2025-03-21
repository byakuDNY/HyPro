import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@/db/schema";
import envConfig from "@/lib/env-config";

const db = drizzle({
  connection: envConfig().database.url,
  casing: "snake_case",
  schema,
});

export default db;
