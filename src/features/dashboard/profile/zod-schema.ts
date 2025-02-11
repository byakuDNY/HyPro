import { object } from "zod";

import {
  getEmailSchema,
  getLogoSchema,
  getNameSchema,
  getPasswordSchema,
} from "@/features/auth/zod-schema";

export const updateUserNameAndImageSchema = object({
  name: getNameSchema(),
  image: getLogoSchema(),
});

export const changeEmailSchema = object({
  email: getEmailSchema(),
});

export const changePasswordSchema = object({
  currentPassword: getPasswordSchema(),
  newPassword: getPasswordSchema(),
});
