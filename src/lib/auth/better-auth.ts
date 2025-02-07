import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkey } from "better-auth/plugins/passkey";

import db from "@/db";
import resend from "@/lib/email/resend";

import envConfig from "../env-config";

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: envConfig.email.customEmail,
        to: user.email,
        subject: "Password Reset",
        text: `Your Password Reset Link ${url}`,
      });

      if (error) {
        return console.error({ error });
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const urlToUpdate = new URL(url);

      urlToUpdate.searchParams.set("callbackURL", "/dashboard");

      const updatedUrl = urlToUpdate.toString();

      const { error } = await resend.emails.send({
        from: envConfig.email.customEmail,
        to: user.email,
        subject: "Email verification",
        text: `Your Email verification Link ${updatedUrl}`,
      });

      if (error) {
        return console.error({ error });
      }
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        try {
          await resend.emails.send({
            from: envConfig.email.customEmail,
            to: newEmail,
            subject: "Verify your email change",
            text: `Click the link to verify: ${url}`,
          });
        } catch (error) {
          console.log(
            "Error in sending change email verification email: ",
            error,
          );
        }
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async (
        { user, url }, // The original request object (optional)
      ) => {
        try {
          await resend.emails.send({
            from: envConfig.email.customEmail,
            to: user.email,
            subject: "Verify your identity to delete account",
            text: `Click the link to verify: ${url}`,
          });
        } catch (error) {
          console.log(
            "Error in sending change email verification email: ",
            error,
          );
        }
      },
    },
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
    storage: "database",
    modelName: "rate_limits",
    window: 10,
    max: 20,
    customRules: {
      "/sign-in": { window: 10, max: 5 },
      "/sign-up": { window: 10, max: 5 },
    },
  },
  plugins: [
    passkey(),
    // nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export default auth;
