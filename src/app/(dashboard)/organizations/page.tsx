import { headers } from "next/headers";

import { OrganizationCard } from "@/features/organizations/components/organization-card";
import auth from "@/lib/auth/better-auth";

const Organization = async () => {
  const [session, organization] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    auth.api.getFullOrganization({
      headers: await headers(),
    }),
  ]);

  return (
    <OrganizationCard session={session} activeOrganization={organization} />
  );
};

export default Organization;
