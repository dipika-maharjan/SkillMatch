import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Trash2,
} from "lucide-react";
import SettingsShell from "../components/SettingsShell";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
} from "../services/api";

const iconMap = {
  job_match: Bell,
  resume_insight: Sparkles,
  application_update: Eye,
  system: CheckCircle2,
  custom: Bell,
};

export default function NotificationsSettings() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [notificationsRes, unreadRes] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ]);

      setNotifications(notificationsRes.data?.notifications || []);
      setUnreadCount(unreadRes.data?.unreadCount || 0);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load notifications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const visibleNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (filter === "unread") return !notification.isRead;
      return true;
    });
  }, [filter, notifications]);

  const handleMarkAll = async () => {
    setActionLoading(true);
    try {
      await markAllNotificationsRead();
      await loadData();
      setMessage("All notifications marked as read.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update notifications.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    setActionLoading(true);
    try {
      await markNotificationRead(id);
      await loadData();
      setMessage("Notification marked as read.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update notification.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await deleteNotification(id);
      await loadData();
      setMessage("Notification deleted.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete notification.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <SettingsShell
      title="Notifications"
      subtitle="Stay updated with your career progression and AI insights."
      rightContent={
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Unread</p>
              <p className="text-xs text-slate-500">
                Current unread notifications
              </p>
            </div>
            <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">
              {unreadCount}
            </div>
          </div>

          <button
            type="button"
            onClick={handleMarkAll}
            disabled={actionLoading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        </div>
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === "all" ? "bg-indigo-600 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === "unread" ? "bg-indigo-600 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}
        >
          Unread
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-3xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
            Loading notifications...
          </div>
        ) : visibleNotifications.length ? (
          visibleNotifications.map((notification) => {
            const Icon = iconMap[notification.type] || Bell;

            return (
              <article
                key={notification._id}
                className="flex items-start gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="h-2 w-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {notification.message}
                      </p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-slate-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(notification._id)}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600"
                      >
                        <EyeOff className="h-3.5 w-3.5" />
                        Mark read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(notification._id)}
                      className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-3xl bg-white p-10 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            You’re all caught up for now.
          </div>
        )}
      </div>

      {message && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-lg">
          {message}
        </div>
      )}
    </SettingsShell>
  );
}
