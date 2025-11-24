import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { PATHS } from "./constants/common";
import NotFound from "./pages/NotFound";
import { protectedRouter, publicRouter } from "./router";
import { useAuthStore } from "./store/authStore";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

function App() {
  const appRoutes = createBrowserRouter([
    ...protectedRouter,
    ...publicRouter,
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  // Setup logout event listener
  useEffect(() => {
    const logout = useAuthStore.getState().logout;
    const handleLogout = () => {
      logout();
      // Use window.location for navigation outside router context
      window.location.href = PATHS.LOGIN;
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={appRoutes} />
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
