import { ChevronRight, CircleUserRound, Bell, Lock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Account", href: "/settings/profile", icon: CircleUserRound },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
  { label: "Change Password", href: "/settings/change-password", icon: Lock },
];

export default function SettingsShell({
  title,
  subtitle,
  children,
  rightContent,
  showHeader = true,
}) {
  const location = useLocation();

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="w-[250px] shrink-0 border-r border-slate-200 bg-white px-5 py-6">
          <Link to="/dashboard" className="mb-8 block text-lg font-bold text-indigo-600 hover:text-indigo-700 transition">
            SkillMatch
          </Link>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    active
                      ? "bg-indigo-50 font-semibold text-indigo-700 ring-1 ring-indigo-100"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 px-8 py-8 xl:px-12">
          {showHeader && title && (
            <div className="mb-5 text-xs text-slate-500">
              <Link to="/settings" className="font-medium text-slate-700 hover:text-indigo-600 transition">Settings</Link>
              <ChevronRight className="mx-1 inline h-3 w-3" />
              <span className="text-indigo-600">{title}</span>
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
            <section>
              {showHeader && subtitle && (
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                  <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
                </div>
              )}

              {children}
            </section>

            <aside className="hidden xl:block">{rightContent}</aside>
          </div>
        </main>
      </div>
    </div>
  );
}
