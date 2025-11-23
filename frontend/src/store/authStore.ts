import Cookies from "js-cookie";
import { create } from "zustand";

import type { User } from "@/interfaces/auth";
import dayjs from "@/lib/dayjs";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    refreshExpiresIn: number
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  setCredentials: (data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
  }) => Promise<void>;
  removeCredentials: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getUser: () => User | null;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,

  login: async (accessToken, refreshToken, expiresIn, refreshExpiresIn) => {
    // Calculate expiration dates
    const accessTokenExpires = dayjs().add(expiresIn, "second").toDate();
    const refreshTokenExpires = dayjs()
      .add(refreshExpiresIn, "second")
      .toDate();

    // Store tokens in cookies with expiration
    Cookies.set("accessToken", accessToken, {
      expires: accessTokenExpires,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    Cookies.set("refreshToken", refreshToken, {
      expires: refreshTokenExpires,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Update state with tokens
    set({ accessToken, refreshToken });
    // Note: User profile will be fetched automatically by useProfile hook in PrivateRoute
  },

  logout: () => {
    // Remove from cookies
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Clear state
    set({ accessToken: null, refreshToken: null, user: null });
  },

  isAuthenticated: () => {
    // Check both state and cookies for reliability
    const stateToken = get().accessToken;
    const cookieToken = Cookies.get("accessToken");
    return !!(stateToken || cookieToken);
  },

  setCredentials: async (data) => {
    // Calculate expiration dates
    const accessTokenExpires = dayjs().add(data.expiresIn, "second").toDate();
    const refreshTokenExpires = dayjs()
      .add(data.refreshExpiresIn, "second")
      .toDate();

    // Store tokens in cookies with expiration
    Cookies.set("accessToken", data.accessToken, {
      expires: accessTokenExpires,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    Cookies.set("refreshToken", data.refreshToken, {
      expires: refreshTokenExpires,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Update state with tokens
    set({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    // Note: User profile will be fetched automatically by useProfile hook in PrivateRoute
  },

  removeCredentials: () => {
    // Remove from cookies
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Clear state
    set({ accessToken: null, refreshToken: null, user: null });
  },

  getAccessToken: () => {
    // Always read from cookies for reliability
    return Cookies.get("accessToken") || null;
  },

  getRefreshToken: () => {
    // Always read from cookies for reliability
    return Cookies.get("refreshToken") || null;
  },

  getUser: () => {
    // Return user from state
    return get().user;
  },

  setUser: (user: User) => {
    set({ user });
  },
}));
