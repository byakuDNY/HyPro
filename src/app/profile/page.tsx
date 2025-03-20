import { headers } from "next/headers";
import { redirect } from "next/navigation";

import UserCard from "@/features/profile/components/user-card";
import auth from "@/lib/auth/better-auth";

const Profile = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });

  const { provider } = (
    await auth.api.listUserAccounts({
      headers: await headers(),
    })
  )[0];

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="p-4">
      <UserCard user={session.user} provider={provider} />
    </div>
  );
};
export default Profile;
