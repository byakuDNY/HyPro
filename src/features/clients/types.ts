import { clients } from "@/db/schema";

export type ClientInsertType = typeof clients.$inferInsert;
export type ClientSelectType = Omit<
  typeof clients.$inferSelect,
  "userId" | "organizationId"
>;
