import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function SettingsHome() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Account Settings",
      description: "Update your profile information.",
      href: "/settings/profile",
    },
    {
      title: "Notifications",
      description: "Choose how you want to be alerted about opportunities.",
      href: "/settings/notifications",
    },
    {
      title: "Change Password",
      description: "Update your security credentials regularly to maintain safety.",
      href: "/settings/change-password",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 px-6 py-8 sm:px-8">
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your account preferences and personal configuration.
          </p>
        </div>

        <div className="max-w-4xl space-y-5">
          {cards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => navigate(card.href)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-900">{card.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{card.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}