import { z } from "zod";

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

export const getLogoSchema = () => z.string().optional();
