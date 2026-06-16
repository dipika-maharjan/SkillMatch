import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  FileText,
  Bookmark,
  Edit,
  Settings,
  X,
} from "lucide-react";

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Jobs", href: "/dashboard#jobs", icon: Briefcase },
    { label: "Applications", href: "/dashboard#applications", icon: FileText },
    { label: "Saved Jobs", href: "/dashboard#saved-jobs", icon: Bookmark },
    { label: "Resume", href: "/dashboard#resume", icon: Edit },
    { label: "Settings", href: "/dashboard#settings", icon: Settings },
  ];

  const isActive = (href) => {
    const [path, hash] = href.split("#");

    if (hash) {
      return location.pathname === path && location.hash === `#${hash}`;
    }

    return location.pathname === href && !location.hash;
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-gray-900/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-gray-50 transition-transform lg:sticky lg:top-0 lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-6">
          <h1 className="text-lg font-bold text-indigo-600">SkillMatch</h1>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  active
                    ? "bg-indigo-100 font-medium text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 px-4 py-6">
          <p className="text-center text-xs text-gray-500">
            © 2026 SkillMatch
          </p>
        </div>
      </aside>
    </>
  );
}
