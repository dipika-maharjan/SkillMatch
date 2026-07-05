export default function DashboardStats({ stats }) {
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      note: "Registered candidates and admins",
      accent: "border-teal-500",
    },
    {
      title: "Active Jobs",
      value: stats?.activeJobs || 0,
      note: "Open roles currently visible",
      accent: "border-sky-500",
    },
    {
      title: "Applications",
      value: stats?.totalApplications || 0,
      note: "Total candidate submissions",
      accent: "border-violet-500",
    },
    {
      title: "Placements",
      value: stats?.placements || 0,
      note: "Accepted application outcomes",
      accent: "border-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => (
        <div
          key={card.title}
          className={`rounded-lg border border-zinc-200 border-t-4 ${card.accent} bg-white p-5 shadow-sm`}
        >
          <p className="text-sm font-medium text-zinc-500">{card.title}</p>
          <p className="mt-3 text-3xl font-semibold text-zinc-950">
            {card.value}
          </p>
          <p className="mt-2 text-sm leading-5 text-zinc-600">{card.note}</p>
        </div>
      ))}
    </div>
  );
}
