import Cookies from "js-cookie";
import { create } from "zustand";

import type { User } from "@/interfaces/auth";
import dayjs from "@/lib/dayjs";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  login: (accessToken: string, expiresIn: number) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  setCredentials: (data: {
    accessToken: string;
    expiresIn: number;
  }) => Promise<void>;
  removeCredentials: () => void;
  getAccessToken: () => string | null;
  getUser: () => User | null;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  accessToken: null,
  user: null,

  login: async (accessToken, expiresIn) => {
    // Calculate expiration date
    const accessTokenExpires = dayjs().add(expiresIn, "second").toDate();

    // Store accessToken in cookie (non-HttpOnly for client-side access)
    Cookies.set("accessToken", accessToken, {
      expires: accessTokenExpires,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Update state with accessToken
    // Note: refreshToken is now handled automatically by browser via HttpOnly cookie
    set({ accessToken });
    // Note: User profile will be fetched automatically by useProfile hook in PrivateRoute
  },

  logout: () => {
    // Remove accessToken from cookies
    Cookies.remove("accessToken");
    // Note: refreshToken cookie will be cleared by backend on logout endpoint if needed

    // Clear state
    set({ accessToken: null, user: null });
  },

  isAuthenticated: () => {
    // Check both state and cookies for reliability
    const stateToken = get().accessToken;
    const cookieToken = Cookies.get("accessToken");
    return !!(stateToken || cookieToken);
  },

  setCredentials: async (data) => {
    // Calculate expiration date
    const accessTokenExpires = dayjs().add(data.expiresIn, "second").toDate();

    // Store accessToken in cookie
    Cookies.set("accessToken", data.accessToken, {
      expires: accessTokenExpires,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Update state with accessToken
    // Note: refreshToken is now handled automatically by browser via HttpOnly cookie
    set({
      accessToken: data.accessToken,
    });
    // Note: User profile will be fetched automatically by useProfile hook in PrivateRoute
  },

  removeCredentials: () => {
    // Remove accessToken from cookies
    Cookies.remove("accessToken");
    // Note: refreshToken cookie will be cleared by backend on logout endpoint if needed

    // Clear state
    set({ accessToken: null, user: null });
  },

  getAccessToken: () => {
    // Always read from cookies for reliability
    return Cookies.get("accessToken") || null;
  },

  getUser: () => {
    // Return user from state
    return get().user;
  },

  setUser: (user: User) => {
    set({ user });
  },
}));
