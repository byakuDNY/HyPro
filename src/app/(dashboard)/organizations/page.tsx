import { headers } from "next/headers";
import { redirect } from "next/navigation";

import OrganizationCard from "@/features/organizations/components/organization-card";
import auth from "@/lib/auth/better-auth";

const Organization = async () => {
  const [session, organization, listOrganizations] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    auth.api.getFullOrganization({
      headers: await headers(),
    }),
    auth.api.listOrganizations({
      headers: await headers(),
    }),
  ]);

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="p-4">
      <OrganizationCard
        user={session.user}
        activeOrganization={organization}
        listOrganizations={listOrganizations}
      />
    </div>
  );
};

export default Organization;
