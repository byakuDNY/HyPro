import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { oneTap, organization } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

import db from "@/db";
import resend from "@/lib/email/resend";

import { reactInvitationEmail } from "../email/invitation";
import envConfig from "../env-config";

const auth = betterAuth({
  appName: "Hypro",
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: envConfig().email.sender,
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
        from: envConfig().email.sender,
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
            from: envConfig().email.sender,
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
      sendDeleteAccountVerification: async ({ user, url }) => {
        try {
          await resend.emails.send({
            from: envConfig().email.sender,
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
      clientId: envConfig().auth.github.clientId,
      clientSecret: envConfig().auth.github.clientSecret,
    },
    google: {
      clientId: envConfig().auth.google.clientId,
      clientSecret: envConfig().auth.google.clientSecret,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: false,
      maxAge: 5 * 60, // 5 minutes
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
    organization({
      async sendInvitationEmail(data) {
        await resend.emails.send({
          from: envConfig().email.sender,
          to: data.email,
          subject: "You've been invited to join an organization",
          react: reactInvitationEmail({
            username: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink:
              process.env.NODE_ENV === "development"
                ? `http://localhost:3000/accept-invitation/${data.id}`
                : `${
                    process.env.BETTER_AUTH_URL ||
                    "https://demo.better-auth.com"
                  }/accept-invitation/${data.id}`,
          }),
        });
      },
      // allowUserToCreateOrganization: async (user) => {
      //   const subscription = await getSubscription(user.id);
      //   return subscription.plan === "pro";
      // },
    }),
    passkey(),
    oneTap(),
    nextCookies(),
  ],
});

export default auth;
