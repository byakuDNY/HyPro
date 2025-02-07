import { object } from "zod";

import {
  getEmailSchema,
  getNameSchema,
  getPasswordSchema,
} from "@/features/auth/zod-schema";

export const updateUserNameAndImageSchema = object({
  name: getNameSchema(),
  // image: z.string().url(),
});

export const changeEmailSchema = object({
  email: getEmailSchema(),
});

export const changePasswordSchema = object({
  currentPassword: getPasswordSchema(),
  newPassword: getPasswordSchema(),
});
