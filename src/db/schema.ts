import {
  boolean,
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }),
};

export const users = pgTable("users", {
  id: text().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 320 }).unique().notNull(),
  emailVerified: boolean().notNull(),
  image: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
});

export const PROJECT_STATUS_ENUM = pgEnum("project_status", [
  "ACTIVE",
  "COMPLETED",
  "ON-HOLD",
  "CANCELLED",
]);

export const clients = pgTable("clients", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).unique().notNull(),
  email: varchar({ length: 320 }).unique().notNull(),
  description: varchar({ length: 255 }),
  contact: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 255 }).unique().notNull(),
  country: varchar({ length: 255 }),
  ...timestamps,
  userId: text()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  organizationId: text().references(() => organizations.id, {
    onDelete: "cascade",
  }),
});

export const projects = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  content: text(),
  userId: text()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  clientId: uuid()
    .references(() => clients.id, {
      onDelete: "cascade",
    })
    .notNull(),
  budget: numeric({ precision: 10, scale: 2 }).notNull(),
  status: PROJECT_STATUS_ENUM().default("ACTIVE").notNull(),
  startDate: date().defaultNow().notNull(),
  endDate: date().notNull(),
  ...timestamps,
  organizationId: text().references(() => organizations.id, {
    onDelete: "cascade",
  }),
});

export const projectKV = pgTable("project_kv", {
  id: uuid().primaryKey().defaultRandom(),
  projectId: uuid()
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  key: varchar({ length: 255 }).notNull(),
  value: varchar({ length: 255 }).notNull(),
});

export const invoices = pgTable("invoices", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  projectId: uuid()
    .references(() => projects.id, {
      onDelete: "cascade",
    })
    .notNull(),
  clientId: uuid().references(() => clients.id, {
    onDelete: "cascade",
  }),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  ...timestamps,
});

export const PAYMENT_STATUS_ENUM = pgEnum("payment_status", [
  "PENDING",
  "PAID",
  "CANCELLED",
]);

export const payments = pgTable("payments", {
  id: uuid().primaryKey().defaultRandom(),
  invoiceId: uuid()
    .references(() => invoices.id, { onDelete: "cascade" })
    .notNull(),
  userId: text()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  status: PAYMENT_STATUS_ENUM().default("PENDING").notNull(),
  method: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export const sessions = pgTable("sessions", {
  id: text().primaryKey(),
  expiresAt: timestamp().notNull(),
  token: text().notNull().unique(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text()
    .references(() => users.id)
    .notNull(),
  activeOrganizationId: text(),
});

export const accounts = pgTable("accounts", {
  id: text().primaryKey(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text()
    .references(() => users.id)
    .notNull(),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  password: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
});

export const verifications = pgTable("verifications", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
});

export const passkeys = pgTable("passkeys", {
  id: text().primaryKey(),
  name: text(),
  publicKey: text().notNull(),
  userId: text()
    .notNull()
    .references(() => users.id),
  credentialID: text().notNull(),
  counter: integer().notNull(),
  deviceType: text().notNull(),
  backedUp: boolean().notNull(),
  transports: text(),
  createdAt: timestamp(),
});

export const organizations = pgTable("organization", {
  id: text().primaryKey(),
  name: text().notNull(),
  slug: text().unique(),
  logo: text(),
  createdAt: timestamp().notNull(),
  metadata: text(),
});

export const members = pgTable("member", {
  id: text().primaryKey(),
  organizationId: text()
    .notNull()
    .references(() => organizations.id),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text().notNull(),
  createdAt: timestamp().notNull(),
});

export const invitations = pgTable("invitation", {
  id: text().primaryKey(),
  organizationId: text()
    .notNull()
    .references(() => organizations.id),
  email: text().notNull(),
  role: text(),
  status: text().notNull(),
  expiresAt: timestamp().notNull(),
  inviterId: text()
    .notNull()
    .references(() => users.id),
});
