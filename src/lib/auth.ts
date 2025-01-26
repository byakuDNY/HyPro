import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db from "@/db";

import envConfig from "./env-config";

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: envConfig.auth.githubOauth.clientId,
      clientSecret: envConfig.auth.githubOauth.clientSecret,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  rateLimit: {
    window: 10,
    max: 20,
    customRules: {
      "/sign-in": { window: 10, max: 5 },
      "/sign-up": { window: 10, max: 5 },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export default auth;
