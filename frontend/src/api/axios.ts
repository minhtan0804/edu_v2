import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from "axios";

import type { RefreshTokenResponse } from "@/interfaces/common";

import { useAuthStore } from "../store/authStore";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuth?: boolean;
}

interface RequestOptions {
  skipAuth?: boolean;
}

// Feature flag for refresh token (can be moved to env or config)
const FEATURE_FLAGS = {
  ENABLE_REFRESH_TOKEN: true,
};

let refreshTokenPromise: Promise<string> | false = false;

const baseConfig: CreateAxiosDefaults = {
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`,

  headers: {
    "Content-Type": "application/json",
  },
};

// Instance without interceptors for refresh token call
export const instanceWithoutInterceptors = axios.create(baseConfig);

// Main instance with interceptors
export const instance = axios.create(baseConfig);

// Request interceptor - Add token to requests
instance.interceptors.request.use(
  (config) => {
    const customConfig = config as CustomAxiosRequestConfig;

    // Skip auth if skipAuth option is set
    if (customConfig.skipAuth) {
      return config;
    }

    const accessToken = useAuthStore.getState().getAccessToken();

    if (accessToken && config && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors and refresh token
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Only handle refresh token logic if feature flag is enabled
    if (!FEATURE_FLAGS.ENABLE_REFRESH_TOKEN) {
      // If refresh token is disabled, logout on 401
      if (error.response?.status === 401) {
        useAuthStore.getState().removeCredentials();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    const originalRequest = error.config as
      | CustomAxiosRequestConfig
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuth
    ) {
      originalRequest._retry = true;

      if (!refreshTokenPromise) {
        // Start a new refresh token request
        const refreshToken = useAuthStore.getState().getRefreshToken();

        if (refreshToken) {
          refreshTokenPromise = instanceWithoutInterceptors
            .post<RefreshTokenResponse>("/auth/refresh", { refreshToken })
            .then(async (response) => {
              await useAuthStore.getState().setCredentials({
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
                expiresIn: response.data.expiresIn,
                refreshExpiresIn: response.data.refreshExpiresIn,
              });
              return response.data.accessToken;
            })
            .catch((err) => {
              useAuthStore.getState().removeCredentials();
              window.location.href = "/login";
              return Promise.reject(err);
            })
            .finally(() => {
              refreshTokenPromise = false; // Reset after completion
            });
        } else {
          useAuthStore.getState().removeCredentials();
          window.location.href = "/login";
          return Promise.reject(error);
        }
      }

      // Wait for the refresh token request to complete
      try {
        const accessToken = await refreshTokenPromise;
        if (originalRequest.headers && accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return instance(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().removeCredentials();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 401 && !originalRequest?.skipAuth) {
      useAuthStore.getState().removeCredentials();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Request object with methods
export const request = {
  get: <TResponse = unknown>(
    url: string,
    config?: AxiosRequestConfig & RequestOptions
  ): Promise<TResponse> => {
    const { skipAuth, ...axiosConfig } = config || {};
    const customConfig = {
      ...axiosConfig,
      skipAuth,
    } as CustomAxiosRequestConfig;
    return instance.get<TResponse>(url, customConfig).then((res) => res.data);
  },

  post: <TRequest = unknown, TResponse = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig & RequestOptions
  ): Promise<TResponse> => {
    const { skipAuth, ...axiosConfig } = config || {};
    const customConfig = {
      ...axiosConfig,
      skipAuth,
    } as CustomAxiosRequestConfig;
    return instance
      .post<TResponse>(url, data, customConfig)
      .then((res) => res.data);
  },

  put: <TRequest = unknown, TResponse = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig & RequestOptions
  ): Promise<TResponse> => {
    const { skipAuth, ...axiosConfig } = config || {};
    const customConfig = {
      ...axiosConfig,
      skipAuth,
    } as CustomAxiosRequestConfig;
    return instance
      .put<TResponse>(url, data, customConfig)
      .then((res) => res.data);
  },

  patch: <TRequest = unknown, TResponse = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig & RequestOptions
  ): Promise<TResponse> => {
    const { skipAuth, ...axiosConfig } = config || {};
    const customConfig = {
      ...axiosConfig,
      skipAuth,
    } as CustomAxiosRequestConfig;
    return instance
      .patch<TResponse>(url, data, customConfig)
      .then((res) => res.data);
  },

  delete: <TResponse = unknown>(
    url: string,
    config?: AxiosRequestConfig & RequestOptions
  ): Promise<TResponse> => {
    const { skipAuth, ...axiosConfig } = config || {};
    const customConfig = {
      ...axiosConfig,
      skipAuth,
    } as CustomAxiosRequestConfig;
    return instance
      .delete<TResponse>(url, customConfig)
      .then((res) => res.data);
  },
};

// Export instance for backward compatibility
export const api = instance;
