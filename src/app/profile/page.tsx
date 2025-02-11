import { headers } from "next/headers";

import ChangeEmail from "@/features/dashboard/profile/components/change-email";
import DeleteUser from "@/features/dashboard/profile/components/delete-user";
import UserCard from "@/features/dashboard/profile/components/user-card";
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

  return (
    <div>
      <UserCard session={session} provider={provider} />
      <ChangeEmail session={session} />
      <DeleteUser />
    </div>
  );
};
export default Profile;
