import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { PATHS } from "@/constants/common";
import { useProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/store/authStore";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const { user, isLoading } = useProfile();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [setUser, user]);

  // Check authentication first
  if (!isAuthenticated()) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is ADMIN
  if (!user || user.role !== "ADMIN") {
    // Redirect to home or show unauthorized message
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <>{children}</>;
}
