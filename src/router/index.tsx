import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import AppLayout from "../layouts/AppLayout";
import { PublicRoute } from "../components/PublicRoute";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const DevicesPage = lazy(() => import("../pages/DevicesPage"));
const StreamPage = lazy(() => import("../pages/StreamPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "devices",
        element: <DevicesPage />,
      },
      {
        path: "stream",
        element: <StreamPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
