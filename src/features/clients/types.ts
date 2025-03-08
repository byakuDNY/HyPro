import { clients } from "@/db/schema";

export type ClientInsertType = Omit<
  typeof clients.$inferInsert,
  "organizationId" | "userId"
>;

export type ClientSelectType = typeof clients.$inferSelect;
