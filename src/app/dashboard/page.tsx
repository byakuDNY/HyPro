import { headers } from "next/headers";
import React from "react";

import SignOutClient from "@/features/auth/components/sign-out-client";
import ChangeEmail from "@/features/dashboard/profile/components/change-email";
import ChangePassword from "@/features/dashboard/profile/components/change-password";
import DeleteUser from "@/features/dashboard/profile/components/delete-user";
import EnablePasskey from "@/features/dashboard/profile/components/enable-passkey";
import UpdateUser from "@/features/dashboard/profile/components/update-user";
import auth from "@/lib/auth/better-auth";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });

  const user = session?.user;

  const { provider } = (
    await auth.api.listUserAccounts({
      headers: await headers(),
    })
  )[0];

  return (
    <div>
      Dashboard
      <SignOutClient />
      <ul>
        <li>{user?.name}</li>
        <li>{user?.email}</li>
      </ul>
      <section className="space-y-8">
        <UpdateUser session={session!} />
        <EnablePasskey />

        {provider === "credential" ? (
          <>
            <ChangeEmail session={session!} />
            <ChangePassword />
          </>
        ) : (
          <p>Change password and email is not allowed on Oath</p>
        )}

        <DeleteUser />
      </section>
    </div>
  );
};

export default Dashboard;
