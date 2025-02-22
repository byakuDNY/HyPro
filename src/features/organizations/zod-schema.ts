import { object } from "zod";

import { getLogoSchema, getNameSchema } from "@/lib/zod-helper";

export const createOrganizationSchema = object({
  name: getNameSchema(),
  slug: getNameSchema(),
  logo: getLogoSchema(),
});
