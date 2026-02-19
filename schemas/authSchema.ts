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
    .min(4, "Full name must be at least 4 characters")
    .max(70, "Full name must not exceed 70 characters"),

  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 5, {
      message: "Address must be at least 5 characters",
    }),

  street: z.string().trim(),
  barangay: z.string().trim(),
  city: z.string().trim(),
  province: z.string().trim(),
  postalCode: z.string().trim(),
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
