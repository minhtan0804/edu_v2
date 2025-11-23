export const PATHS = {
  BASE: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  CHECK_EMAIL: "/check-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  VERIFY_EMAIL_ERROR: "/verify-email/error",
  RESEND_VERIFICATION: "/resend-verification",
  INSTRUCTOR_VERIFICATION: "/instructor/verification",
  HOME: "/",
  // Admin paths
  ADMIN: "/admin",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_COURSES: "/admin/courses",
  ADMIN_USERS: "/admin/users",
  ADMIN_SETTINGS: "/admin/settings",
} as const;
