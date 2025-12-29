import * as z from "zod";

export const RegisterSchema = z
  .object({
    username: z.string().min(2, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const ResetPassSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const ProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(8, "Full name must be at least 5 characters")
    .max(100, "Full name must not exceed 100 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Full name contains invalid characters"),

  address: z.string().min(5, "Address is required").optional(),
});

export const ChangePassSchema = z
  .object({
    oldPassword: z.string().min(8, "Old password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type ResetPassSchemaType = z.infer<typeof ResetPassSchema>;
export type ProfileSchemaType = z.infer<typeof ProfileSchema>;
export type ChangePassSchemaType = z.infer<typeof ChangePassSchema>;
