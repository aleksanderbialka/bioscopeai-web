import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

export function Header() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "font-medium transition-colors " +
    (isActive ? "text-sky-600" : "text-gray-700 hover:text-sky-600");

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-sky-600">BIOSCOPEAI</h1>

          <nav className="flex gap-6 items-center">
            <NavLink to="/" className={linkClass} end>
              Dashboard
            </NavLink>

            <NavLink to="/devices" className={linkClass}>
              Devices
            </NavLink>

            <NavLink to="/stream" className={linkClass}>
              Stream
            </NavLink>

            <div className="flex items-center gap-4 ml-6 pl-6 border-l border-gray-300">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
