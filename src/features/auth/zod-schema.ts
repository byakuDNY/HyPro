import { object, z } from "zod";

import { FormType } from "@/features/auth/components/auth-form";

// zod helper functions
export const getNameSchema = () =>
  z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be less than 50 characters long" });

export const getEmailSchema = () =>
  z.string().email({ message: "Please enter a valid email address" });

export const getPasswordSchema = () =>
  z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(32, { message: "Password must be less than 32 characters long" });

// schema for auth-form page
export const authFormSchema = (formType: FormType) => {
  const baseSchema = z.object({
    email: getEmailSchema(),
    password: getPasswordSchema(),
  });

  return formType === "sign-up"
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
