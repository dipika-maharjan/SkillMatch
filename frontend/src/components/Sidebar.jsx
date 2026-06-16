import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  FileText,
  Bookmark,
  Edit,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Jobs", href: "/jobs", icon: Briefcase },
    { label: "Applications", href: "/applications", icon: FileText },
    { label: "Saved Jobs", href: "/saved-jobs", icon: Bookmark },
    { label: "Resume", href: "/resume", icon: Edit },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-gray-200">
        <h1 className="text-lg font-bold text-indigo-600">SkillMatch</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? "bg-indigo-100 text-indigo-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          © 2024 SkillMatch
        </p>
      </div>
    </aside>
  );
}