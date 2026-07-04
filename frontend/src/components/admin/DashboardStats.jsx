import { TrendingUp, Users, Briefcase, FileText } from "lucide-react";

export default function DashboardStats({ stats }) {
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "blue",
      trend: stats?.usersTrend || 0,
    },
    {
      title: "Active Jobs",
      value: stats?.activeJobs || 0,
      icon: Briefcase,
      color: "indigo",
      trend: stats?.jobsTrend || 0,
    },
    {
      title: "Applications",
      value: stats?.totalApplications || 0,
      icon: FileText,
      color: "purple",
      trend: stats?.applicationsTrend || 0,
    },
    {
      title: "Placements",
      value: stats?.placements || 0,
      icon: TrendingUp,
      color: "green",
      trend: stats?.placementsTrend || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        const colorClasses = {
          blue: "bg-blue-100 text-blue-600",
          indigo: "bg-indigo-100 text-indigo-600",
          purple: "bg-purple-100 text-purple-600",
          green: "bg-green-100 text-green-600",
        };

        return (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${colorClasses[card.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            {card.trend !== 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`${card.trend > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {card.trend > 0 ? "↑" : "↓"} {Math.abs(card.trend)}%
                </span>
                <span className="text-gray-600">vs last month</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
