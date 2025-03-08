import { headers } from "next/headers";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import DataTable from "@/features/clients/components/data-table";
import Columns from "@/features/clients/components/data-table/columns";
import { getClients } from "@/features/clients/queries";
import auth from "@/lib/auth/better-auth";
import { Session } from "@/lib/auth/types";

const Clients = async () => {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session;

  const { data: clients } = await getClients(
    session.user.id,
    session.session.activeOrganizationId ?? null,
  );

  return (
    <div className="container mx-auto space-y-5 p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Clients({clients.length ?? 0})
        </h1>
        <Button>
          <Link href="/clients/form">Create Client</Link>
        </Button>
      </div>
      <DataTable columns={Columns} data={clients} />
    </div>
  );
};

export default Clients;
