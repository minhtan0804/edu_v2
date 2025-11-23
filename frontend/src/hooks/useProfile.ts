import { useQuery } from "@tanstack/react-query";

import { getProfile } from "@/api/auth";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useAuthStore } from "@/store/authStore";
import { isSuccessResponse } from "@/utils/api-helpers";

export function useProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const query = useQuery({
    queryKey: QUERY_KEYS.auth.profile,
    queryFn: () => getProfile(),
    select: (res) => {
      if (isSuccessResponse(res)) {
        const { user: profileUser } = res.data;
        return profileUser;
      }
      throw new Error(res.error.message);
    },
    enabled: isAuthenticated() && !user, // Only fetch if authenticated but no user
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 1,
  });

  // Return user from store if available, otherwise from query data
  // This ensures we always have the latest user data
  const currentUser = query.data;

  return {
    ...query,
    user: currentUser,
  };
}
