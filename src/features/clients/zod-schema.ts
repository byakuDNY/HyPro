import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { clients } from "@/db/schema";

export const clientInsertSchema = createInsertSchema(clients, {
  email: z.string().email(),
});
export const clientSelectSchema = createSelectSchema(clients);
