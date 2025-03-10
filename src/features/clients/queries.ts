import { notFound } from "next/navigation";

import { and, eq, isNull } from "drizzle-orm";

import db from "@/db";
import { clients, users } from "@/db/schema";

import { ClientSelectType } from "./types";

export const getClients = async (
  userId: string,
  organizationId: string | null,
): Promise<{ data: ClientSelectType[] }> => {
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
        userId: clients.userId,
        organizationId: clients.organizationId,
      })
      .from(clients)
      .leftJoin(users, eq(clients.userId, users.id))
      .where(
        and(
          eq(users.id, userId),
          organizationId === null
            ? isNull(clients.organizationId)
            : eq(clients.organizationId, organizationId),
        ),
      );

    return { data };
  } catch (error) {
    console.error("Failed to get clients:", error);
    throw new Error("Failed to get clients");
  }
};

export const getClient = async (clientId: string) => {
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
        userId: clients.userId,
        organizationId: clients.organizationId,
      })
      .from(clients)
      .leftJoin(users, eq(clients.userId, users.id))
      .where(eq(clients.id, clientId));

    if (data.length === 0) {
      return notFound();
    }

    return { data: data[0] };
  } catch (error) {
    console.error("Failed to get client:", error);
    throw new Error("Failed to get client");
  }
};
