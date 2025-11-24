import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useProfile } from "@/hooks/useProfile";

import { PATHS } from "../constants/common";
import { useAuthStore } from "../store/authStore";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const getUser = useAuthStore((state) => state.getUser);

  // Check if user already exists in store before fetching
  const existingUser = getUser();
  const { user, isLoading } = useProfile({
    enabled: !existingUser, // Only fetch if user not in store
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [setUser, user]);

  if (!isAuthenticated()) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  // Use existing user from store if available, otherwise wait for fetch
  const currentUser = existingUser || user;

  if (!existingUser && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  return <>{children}</>;
}
