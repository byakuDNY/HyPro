"use server";

import { headers } from "next/headers";

import { and, desc, eq, isNull, or } from "drizzle-orm";
import { DatabaseError } from "pg";

import db from "@/db";
import { clients, users } from "@/db/schema";
import auth from "@/lib/auth/better-auth";

import { ClientInsertType, ClientSelectType } from "./types";
import { clientInsertSchema } from "./zod-schema";

type GetClientsResult = { error: string } | { data: ClientSelectType[] };

export const getClients = async (
  userId: string,
  organizationId: string | null,
): Promise<GetClientsResult> => {
  try {
    const data: ClientSelectType[] = await db
      .select({
        id: clients.id,
        name: clients.name,
        email: clients.email,
        createdAt: clients.createdAt,
        updatedAt: clients.updatedAt,
        description: clients.description,
        contact: clients.contact,
        phone: clients.phone,
        country: clients.country,
      })
      .from(clients)
      .leftJoin(users, eq(clients.userId, users.id))
      .where(
        and(
          eq(users.id, userId),
          or(
            eq(clients.organizationId, organizationId),
            isNull(clients.organizationId),
          ),
        ),
      )

      .orderBy(desc(clients.createdAt), desc(clients.updatedAt));

    return { data };
  } catch (error) {
    console.error("Failed to get clients: ", error);
    return { error: "Failed to get clients" };
  }
};

type CreateClientsResult = { error: string } | { success: boolean };

export const createClient = async (
  values: ClientInsertType,
): Promise<CreateClientsResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  const parseValues = clientInsertSchema.parse(values);

  try {
    await db.insert(clients).values(parseValues);
    return { success: true };
  } catch (error) {
    console.error("Failed to create client: ", error);
    if (error instanceof DatabaseError && error.code === "23505") {
      return {
        error: `${error.detail?.split("=")[1]?.replace(/[()]/g, "").trim()}`,
      };
    } else {
      return { error: `Failed to create client: ${parseValues.name}` };
    }
  }
};

type UpdateClientsResult = { error: string } | { success: boolean };

export const updateClient = async (
  values: ClientInsertType,
): Promise<UpdateClientsResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  const parseValues = clientInsertSchema.parse(values);

  try {
    await db
      .update(clients)
      .set(parseValues)
      .where(eq(clients.userId, values.userId));
    return { success: true };
  } catch (error) {
    console.error("Failed to update client: ", error);
    return { error: "Failed to update client" };
  }
};
