import ClientForm from "@/features/clients/components/client-form";
import { getClient } from "@/features/clients/queries";

const UpdateClient = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const { data: client } = await getClient(id);

  return (
    <ClientForm
      isEditMode={true}
      id={client.id}
      name={client.name}
      description={client.description ?? ""}
      contact={client.contact}
      email={client.email}
      phone={client.phone}
      country={client.country ?? ""}
    />
  );
};

export default UpdateClient;
