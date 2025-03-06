import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getClients } from "@/features/clients/actions";
import ClientForm from "@/features/clients/components/client-form";
import DataTable from "@/features/clients/components/data-table";
import Columns from "@/features/clients/components/data-table/columns";
import auth from "@/lib/auth/better-auth";
import { Session } from "@/lib/auth/types";

const Clients = async () => {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session;
  console.log("SESSION", session);
  if (
    !session?.user.id ||
    session?.session.activeOrganizationId === undefined
  ) {
    console.error("Unauthorized");
    redirect("/");
  }

  const result = await getClients(
    session?.user.id,
    session?.session.activeOrganizationId,
  );

  if ("error" in result) {
    redirect("/");
  }

  const { data: clients } = result;
  return (
    <div className="container mx-auto space-y-5 p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Clients({clients.length ?? 0})
        </h1>
        <ClientForm
          userId={session?.user.id}
          organizationId={session?.session.activeOrganizationId}
        />
      </div>
      <DataTable columns={Columns} data={clients} />
    </div>
  );
};

export default Clients;
