import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import AppLayout from "../layouts/AppLayout";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const DevicesPage = lazy(() => import("../pages/DevicesPage"));
const StreamPage = lazy(() => import("../pages/StreamPage"));

export const router = createBrowserRouter([
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
]);
