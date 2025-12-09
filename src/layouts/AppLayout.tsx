import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function AppLayout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-6">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}
