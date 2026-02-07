import { useSelector } from "react-redux";
import { FolderKanban, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const StatsGrid = () => {
  const projects = useSelector((state) => state.project?.projects || []);

  const totalProjects = projects.length;
  
  const completedProjects = projects.filter(
    (p) => p.status === "COMPLETED"
  ).length;

  const activeProjects = projects.filter(
    (p) => p.status === "ACTIVE"
  ).length;

  const onHoldProjects = projects.filter(
    (p) => p.status === "ON_HOLD"
  ).length;

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
    <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                {stat.title}
              </p>
              <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
            <div className={`rounded-full p-2 sm:p-3 ${stat.bgColor} flex-shrink-0 ml-2`}>
              <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;