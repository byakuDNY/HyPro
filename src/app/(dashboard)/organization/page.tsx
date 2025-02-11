import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { OrganizationCard } from "@/features/dashboard/organization/components/organization-card";
import auth from "@/lib/auth/better-auth";

const Organization = async () => {
  const [session, organization] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    auth.api.getFullOrganization({
      headers: await headers(),
    }),
  ]).catch((e) => {
    throw redirect("/sign-in");
  });

  return (
    <OrganizationCard session={session} activeOrganization={organization} />
  );
};

export default Organization;
