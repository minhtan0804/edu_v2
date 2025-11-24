import type { TFunction } from "i18next";
import { z } from "zod";

export function createLoginSchema(t: TFunction<"translation", undefined>) {
  return z.object({
    email: z.string().email(t("validation.emailInvalid")),
    password: z.string().min(6, t("validation.passwordMin")),
  });
}

export type LoginForm = z.infer<ReturnType<typeof createLoginSchema>>;

export function createRegisterSchema(t: TFunction<"translation", undefined>) {
  return z.object({
    email: z.string().email(t("validation.emailInvalid")),
    password: z.string().min(6, t("validation.passwordMin")),
    fullName: z.string().optional(),
  });
}

export type RegisterForm = z.infer<ReturnType<typeof createRegisterSchema>>;

export function createResetPasswordSchema(
  t: TFunction<"translation", undefined>
) {
  return z
    .object({
      newPassword: z
        .string()
        .min(8, t("validation.passwordMin8"))
        .regex(/[A-Z]/, t("validation.passwordUppercase"))
        .regex(/[a-z]/, t("validation.passwordLowercase"))
        .regex(/[0-9]/, t("validation.passwordNumber"))
        .regex(/[^A-Za-z0-9]/, t("validation.passwordSpecial")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwordsDontMatch"),
      path: ["confirmPassword"],
    });
}

export type ResetPasswordForm = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;

export function createResendSchema(t: TFunction<"translation", undefined>) {
  return z.object({
    email: z.string().email(t("validation.emailInvalid")),
  });
}

export type ResendForm = z.infer<ReturnType<typeof createResendSchema>>;
