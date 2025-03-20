import { object, z } from "zod";

import { FormType } from "@/features/auth/components/auth-form";
import {
  getEmailSchema,
  getNameSchema,
  getPasswordSchema,
} from "@/lib/zod-helper";

// schema for auth-form page
export const authFormSchema = (formType: FormType) => {
  const baseSchema = z.object({
    email: getEmailSchema(),
    password: getPasswordSchema(),
  });

  return formType === "SIGN_UP"
    ? baseSchema
        .extend({
          name: getNameSchema(),
          confirmPassword: getPasswordSchema(),
          terms: z.boolean().refine((data) => data, {
            message: "You must agree to the terms and conditions.",
          }),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        })
    : baseSchema;
};

// schema for forgot-password page
export const forgotPasswordSchema = object({
  email: getEmailSchema(),
});

// schema for reset-password page
export const resetPasswordSchema = object({
  password: getPasswordSchema(),
  confirmPassword: getPasswordSchema(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
