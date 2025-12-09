import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Monitor,
  Video,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Logo } from "../../components/Logo";

export function Sidebar() {
  const { user, logout } = useAuth();

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

        <NavLink to="/stream" className={linkClass}>
          <Video className="w-5 h-5" />
          <span className="font-medium">Stream</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-3">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
