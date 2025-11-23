/**
 * React Query Keys
 * Centralized query keys for all API queries
 */

export const QUERY_KEYS = {
  // Auth
  auth: {
    profile: ["auth", "profile"] as const,
    verifyEmail: (token: string) => ["auth", "verifyEmail", token] as const,
  },

  // Categories
  categories: {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", id] as const,
  },

  // Courses
  courses: {
    all: ["courses"] as const,
    detail: (id: string) => ["courses", id] as const,
  },
} as const;
