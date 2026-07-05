export default function RecentActivity({ activities = [] }) {
  const getActivityColor = (type) => {
    switch (type) {
      case "application":
        return "bg-sky-500";
      case "job":
        return "bg-teal-600";
      case "user":
        return "bg-violet-500";
      default:
        return "bg-zinc-400";
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-950">Recent Activity</h2>

      {activities.length > 0 ? (
        <div className="mt-5 divide-y divide-zinc-100">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
            >
              <span
                className={`mt-2 h-2.5 w-2.5 rounded-full ${getActivityColor(activity.type)}`}
              />
              <div className="flex-1">
                <p className="font-medium text-zinc-950">{activity.title}</p>
                <p className="mt-1 text-sm text-zinc-600">
                  {activity.description}
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-zinc-500">
          No recent activity yet.
        </p>
      )}
    </div>
  );
}
