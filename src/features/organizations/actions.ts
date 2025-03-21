"use server";

import { revalidatePath } from "next/cache";

export const revalidatePathAction = async () => {
  console.log("Organization action test");
  revalidatePath("/clients");
  revalidatePath("/organizations");

  return true;
};
