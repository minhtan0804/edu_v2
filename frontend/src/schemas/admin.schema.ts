import type { TFunction } from "i18next";
import { z } from "zod";

export function createCategorySchema(t: TFunction<"translation", undefined>) {
  return z.object({
    name: z.string().min(1, t("validation.required") || "Required"),
    slug: z
      .string()
      .min(1, t("validation.required") || "Required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        t("validation.slugInvalid") || "Invalid slug format"
      ),
    description: z.string().optional(),
  });
}

export type CategoryForm = z.infer<ReturnType<typeof createCategorySchema>>;

export function createCourseSchema(t: TFunction<"translation", undefined>) {
  return z.object({
    title: z.string().min(1, t("validation.required") || "Required"),
    slug: z
      .string()
      .min(1, t("validation.required") || "Required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        t("validation.slugInvalid") || "Invalid slug format"
      ),
    description: z.string().optional(),
    thumbnail: z.string().url().optional().or(z.literal("")),
    price: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().min(0).optional()
    ),
    categoryId: z.string().min(1, t("validation.required") || "Required"),
  });
}

export type CourseForm = z.infer<ReturnType<typeof createCourseSchema>>;

export function createVerificationSchema() {
  return z.object({
    bio: z.string().optional(),
    specialization: z.string().optional(),
    experience: z.string().optional(),
    education: z.string().optional(),
    certificates: z.string().optional(),
  });
}

export type VerificationForm = z.infer<
  ReturnType<typeof createVerificationSchema>
>;
