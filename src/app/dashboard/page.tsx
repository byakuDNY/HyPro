import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import auth from "@/lib/auth";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  return (
    <div>
      Dashboard
      <ul>
        <li>ID: {user?.id}</li>
        <li>Name: {user?.name}</li>
        <li>Email: {user?.email}</li>
        <li>Image: {user?.image}</li>
      </ul>
      <form
        action={async () => {
          "use server";
          await auth.api.signOut({
            headers: await headers(),
          });
          redirect("/sign-in");
        }}
      >
        <Button>Sign out</Button>
      </form>{" "}
    </div>
  );
};

export default Dashboard;
