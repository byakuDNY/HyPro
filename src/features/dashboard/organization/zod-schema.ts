import { object } from "zod";

import { getLogoSchema, getNameSchema } from "@/features/auth/zod-schema";

export const createOrganizationSchema = object({
  name: getNameSchema(),
  slug: getNameSchema(),
  logo: getLogoSchema(),
});
