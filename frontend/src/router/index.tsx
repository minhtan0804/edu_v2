import React from "react";
import type { RouteObject } from "react-router-dom";

import PrivateRoute from "@/components/PrivateRoute";
import { PATHS } from "@/constants/common";
import NotFound from "@/pages/NotFound";

const AuthenticatedLayout = React.lazy(
  () => import("@/layouts/AuthenticatedLayout")
);
const AuthLayout = React.lazy(() => import("@/layouts/AuthLayout"));

const Home = React.lazy(() => import("@/pages/HomePage"));
const Login = React.lazy(() => import("@/pages/auth/LoginPage"));
const Register = React.lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPassword = React.lazy(
  () => import("@/pages/auth/ForgotPasswordPage")
);
const ResetPassword = React.lazy(
  () => import("@/pages/auth/ResetPasswordPage")
);
const CheckEmail = React.lazy(() => import("@/pages/auth/CheckEmailPage"));
const VerifyEmail = React.lazy(() => import("@/pages/VerifyEmailPage"));
const VerifyEmailError = React.lazy(
  () => import("@/pages/auth/VerifyEmailErrorPage")
);
const ResendVerification = React.lazy(
  () => import("@/pages/ResendVerificationPage")
);
const InstructorVerification = React.lazy(
  () => import("@/pages/InstructorVerificationPage")
);

export const protectedRouter: RouteObject[] = [
  {
    path: PATHS.BASE,
    element: (
      <PrivateRoute>
        <AuthenticatedLayout />
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: PATHS.INSTRUCTOR_VERIFICATION,
        element: <InstructorVerification />,
      },
      // Add more protected routes here
    ],
  },
];

export const publicRouter: RouteObject[] = [
  {
    path: PATHS.BASE,
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: PATHS.LOGIN,
        element: <Login />,
      },
      {
        path: PATHS.REGISTER,
        element: <Register />,
      },
      {
        path: PATHS.CHECK_EMAIL,
        element: <CheckEmail />,
      },
      {
        path: PATHS.FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
      {
        path: PATHS.RESET_PASSWORD,
        element: <ResetPassword />,
      },
      {
        path: PATHS.VERIFY_EMAIL,
        element: <VerifyEmail />,
      },
      {
        path: PATHS.VERIFY_EMAIL_ERROR,
        element: <VerifyEmailError />,
      },
      {
        path: PATHS.RESEND_VERIFICATION,
        element: <ResendVerification />,
      },
    ],
  },
];
