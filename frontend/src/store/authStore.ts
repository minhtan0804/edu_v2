import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/interfaces/common";
import dayjs from "@/lib/dayjs";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    refreshExpiresIn: number,
    user: User
  ) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  setCredentials: (data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
    user: User;
  }) => void;
  removeCredentials: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      login: (accessToken, refreshToken, expiresIn, refreshExpiresIn, user) => {
        set({ accessToken, refreshToken, user });

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
      },
      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null });
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("user");
      },
      isAuthenticated: () => {
        return !!get().accessToken;
      },
      setCredentials: (data) => {
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        });

        // Calculate expiration dates
        const accessTokenExpires = dayjs()
          .add(data.expiresIn, "second")
          .toDate();
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
      },
      removeCredentials: () => {
        set({ accessToken: null, refreshToken: null, user: null });
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("user");
      },
      getAccessToken: () => {
        return get().accessToken;
      },
      getRefreshToken: () => {
        return get().refreshToken;
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
