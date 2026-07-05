import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function AdminNavbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Jobs", path: "/admin/jobs" },
    { label: "Applications", path: "/admin/applications" },
    { label: "Analytics", path: "/admin/analytics" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const navClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-teal-700 text-white"
        : "text-zinc-600 hover:bg-teal-50 hover:text-teal-800"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-700 text-sm font-semibold text-white">
              SM
            </span>
            <span>
              <span className="block text-sm font-semibold text-zinc-950">
                SkillMatch
              </span>
              <span className="block text-xs text-zinc-500">Admin</span>
            </span>
          </Link>
        </div>

        <nav className="hidden items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden items-center gap-3 border-l border-zinc-200 pl-4 sm:flex">
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-950">
                {user?.name || user?.fullname || "Admin"}
              </p>
              <p className="text-xs text-zinc-500">Administrator</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800">
              {(user?.name || user?.fullname || "A").charAt(0).toUpperCase()}
            </div>
          </div>
          <button
            onClick={logout}
            className="hidden rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100 md:block"
          >
            Logout
          </button>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-md border border-zinc-300 p-2 text-zinc-700 transition hover:bg-zinc-100 md:hidden"
            aria-label="Toggle admin navigation"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={logout}
              className="mt-2 rounded-md border border-zinc-300 px-3 py-2 text-left text-sm font-semibold text-zinc-700"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
