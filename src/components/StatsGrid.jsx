import { useSelector } from "react-redux";
import { FolderKanban, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const StatsGrid = () => {
  const projects = useSelector((state) => state.project?.projects || []);
  const totalProjects = projects.length;

  const completedProjects = projects.filter(
    (p) => p.status === "COMPLETED",
  ).length;

  const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;

  const onHoldProjects = projects.filter((p) => p.status === "ON_HOLD").length;

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: FolderKanban,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completed",
      value: completedProjects,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active",
      value: activeProjects,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "On Hold",
      value: onHoldProjects,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="my-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
            <div className={`rounded-full p-3 ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
