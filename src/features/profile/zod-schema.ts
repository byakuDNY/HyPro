import { object } from "zod";

import {
  getEmailSchema,
  getLogoSchema,
  getNameSchema,
  getPasswordSchema,
} from "@/lib/zod-helper";

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

export const passkeySchema = object({
  name: getNameSchema(),
});
