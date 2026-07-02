import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import SettingsShell from "../components/SettingsShell";
import { changePassword } from "../services/api";

export default function ChangePasswordSettings() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!message.text) return;

    const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3500);
    return () => clearTimeout(timer);
  }, [message]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    setSaving(true);

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setShowSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsShell
      title="Change Password"
      subtitle="Enter a new password below to change your password."
    >
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Current Password
            </span>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              New Password
            </span>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white"
            />
            <p className="mt-2 text-xs text-slate-400">
              Password must be at least 8 characters long and include special
              symbols.
            </p>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Confirm New Password
            </span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white"
            />
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                })
              }
              className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              Password Updated
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Your password has been changed successfully.
            </p>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {message.text && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-2xl px-4 py-3 text-sm shadow-lg ${message.type === "error" ? "border border-rose-200 bg-rose-50 text-rose-700" : "border border-emerald-200 bg-emerald-50 text-emerald-700"}`}
        >
          {message.text}
        </div>
      )}
    </SettingsShell>
  );
}
