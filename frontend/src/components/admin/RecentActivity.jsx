import { Clock } from "lucide-react";

export default function RecentActivity({ activities = [] }) {
  const getActivityColor = (type) => {
    switch (type) {
      case "application":
        return "bg-blue-100 text-blue-600";
      case "job":
        return "bg-indigo-100 text-indigo-600";
      case "user":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0"
            >
              <div
                className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">No recent activity</p>
      )}
    </div>
  );
}
