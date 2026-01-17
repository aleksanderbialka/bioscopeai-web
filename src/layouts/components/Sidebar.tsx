import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Monitor,
  Database,
  Video,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Logo } from "../../components/Logo";
import { UserProfileModal } from "../../features/auth/components/UserProfileModal";
import { updateUser } from "../../features/auth/api/auth.api";
import type { UserUpdateMe } from "../../features/auth/types/auth.types";

export function Sidebar() {
  const { user, logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleSaveProfile = async (data: UserUpdateMe) => {
    if (!user) return;
    await updateUser(user.id, data);
    window.location.reload();
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative " +
    (isActive
      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30"
      : "text-gray-600 hover:bg-gray-100 hover:text-sky-600");

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <Logo size="md" centered />
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/" className={linkClass} end>
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        <NavLink to="/devices" className={linkClass}>
          <Monitor className="w-5 h-5" />
          <span className="font-medium">Devices</span>
        </NavLink>

        <NavLink to="/datasets" className={linkClass}>
          <Database className="w-5 h-5" />
          <span className="font-medium">Datasets</span>
        </NavLink>

        <NavLink to="/stream" className={linkClass}>
          <Video className="w-5 h-5" />
          <span className="font-medium">Stream</span>
        </NavLink>

        {user?.role === "admin" && (
          <NavLink to="/admin" className={linkClass}>
            <Settings className="w-5 h-5" />
            <span className="font-medium">Admin Panel</span>
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-3">
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md group-hover:scale-105 transition-transform">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          <span>Logout</span>
        </button>
      </div>

      <UserProfileModal
        user={user}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </aside>
  );
}
