import {z} from "zod";

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
  firstName: z.string().min(1, "First name is required"),
  midName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  contactNumber: z.string().min(11, "Please enter a valid contact number"),
  birthday: z.string().optional(),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type ResetPassSchemaType = z.infer<typeof ResetPassSchema>;
export type ProfileSchemaType = z.infer<typeof ProfileSchema>;
