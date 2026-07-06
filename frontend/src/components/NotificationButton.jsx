import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

export default function NotificationButton({
  unreadCount = 0,
  className = "",
  showCount = true,
}) {
  const hasUnread = unreadCount > 0;
  const badgeText = unreadCount > 9 ? "9+" : unreadCount;

  return (
    <Link
      to="/settings/notifications"
      className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-indigo-100 bg-white text-slate-700 shadow-sm shadow-slate-200/70 ring-1 ring-white transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${className}`}
      aria-label={
        hasUnread
          ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
          : "Notifications"
      }
    >
      <span className="absolute inset-1 rounded-full bg-gradient-to-br from-indigo-50 via-white to-sky-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <Bell className="relative h-5 w-5 transition-transform duration-200 group-hover:-rotate-12" />
      {hasUnread && (
        <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
        </span>
      )}
      {hasUnread && showCount && (
        <span className="absolute -bottom-1 -right-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-slate-900 px-1 text-[10px] font-bold leading-none text-white shadow-sm">
          {badgeText}
        </span>
      )}
    </Link>
  );
}
