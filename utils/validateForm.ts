import {ZodSchema} from "zod";

/**
 * Generic reusable form validator for Zod schemas
 * @param schema Zod schema to validate
 * @param data Form data to validate
 * @returns Object with either { success: true, data } or { success: false, errors }
 */
export const validateForm = <T>(
  schema: ZodSchema<T>,
  data: unknown
):
  | {success: true; data: T}
  | {success: false; errors: Record<string, string>} => {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.errors.forEach((err) => {
      const field = err.path[0]?.toString() || "form";
      fieldErrors[field] = err.message;
    });

    return {success: false, errors: fieldErrors};
  }

  return {success: true, data: parsed.data};
};
