import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { clients } from "@/db/schema";

export const clientInsertSchema = createInsertSchema(clients, {
  name: (schema) => schema.min(2),
  email: (schema) => schema.email(),
  contact: (schema) => schema.min(2),
  phone: (schema) => schema.min(6),
  userId: (schema) => schema.optional(),
  organizationId: (schema) => schema.optional(),
});

export const clientInsertSchemaSafer = createInsertSchema(clients, {
  name: (schema) => schema.min(2),
  email: (schema) => schema.email(),
  contact: (schema) => schema.min(2),
  phone: (schema) => schema.min(6),
});
export const clientSelectSchema = createSelectSchema(clients);
