import { NavLink } from "react-router-dom";

export function Header() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "font-medium transition-colors " +
    (isActive ? "text-sky-600" : "text-gray-700 hover:text-sky-600");

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-sky-600">BIOSCOPEAI</h1>

          <nav className="flex gap-6">
            <NavLink to="/" className={linkClass} end>
              Dashboard
            </NavLink>

            <NavLink to="/devices" className={linkClass}>
              Devices
            </NavLink>

            <NavLink to="/stream" className={linkClass}>
              Stream
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
