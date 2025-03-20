import { object, z } from "zod";

import {
  getEmailSchema,
  getLogoSchema,
  getNameSchema,
  getSlugSchema,
} from "@/lib/zod-helper";

export const createOrganizationSchema = object({
  name: getNameSchema(),
  slug: getSlugSchema(),
  logo: getLogoSchema(),
});

export const inviteMemberSchema = object({
  email: getEmailSchema(),
  role: z.enum(["member", "admin"], {
    required_error: "Please select a role",
  }),
});
