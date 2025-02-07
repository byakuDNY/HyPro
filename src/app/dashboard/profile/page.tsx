import { headers } from "next/headers";
import React from "react";

import auth from "@/lib/auth/better-auth";

const Profile = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });

  return <div>Profile</div>;
};
export default Profile;
