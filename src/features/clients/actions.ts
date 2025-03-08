"use server";

import { headers } from "next/headers";

import { eq } from "drizzle-orm";

import db from "@/db";
import { clients } from "@/db/schema";
import auth from "@/lib/auth/better-auth";

import { ClientInsertType } from "./types";
import { clientInsertSchemaSafer } from "./zod-schema";

export const createClient = async (
  values: ClientInsertType,
): Promise<{ error: string | null }> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user.id) {
    return { error: "Unauthorized" };
  }

  const parseValues = clientInsertSchemaSafer.parse({
    ...values,
    userId: session.user.id,
    organizationId: session.session.activeOrganizationId,
  });

  if (parseValues.userId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db.insert(clients).values(parseValues);
    return { error: null };
  } catch (error) {
    console.error("Failed to create client:", error);
    return { error: `Failed to create client: ${parseValues.name}` };
  }
};

export const updateClient = async (
  values: ClientInsertType,
): Promise<{ error: string | null }> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  const parseValues = clientInsertSchemaSafer.parse({
    ...values,
    userId: session.user.id,
    organizationId: session.session.activeOrganizationId,
  });

  if (parseValues.userId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .update(clients)
      .set({ ...parseValues, updatedAt: new Date() })
      .where(eq(clients.id, values.id as string));
    return { error: null };
  } catch (error) {
    console.error("Failed to update client: ", error);
    return { error: `Failed to update client: ${parseValues.name}` };
  }
};
