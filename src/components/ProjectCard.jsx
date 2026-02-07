import { Link } from "react-router-dom";
import { Calendar, Users, CheckCircle2 } from "lucide-react";

const ProjectCard = ({ project }) => {
  const statusColors = {
    PLANNING: "bg-gray-200 text-gray-900",
    ACTIVE: "bg-emerald-200 text-emerald-900",
    ON_HOLD: "bg-amber-200 text-amber-900",
    COMPLETED: "bg-blue-200 text-blue-900",
    CANCELLED: "bg-red-200 text-red-900",
  };

  const priorityColors = {
    LOW: "text-gray-500",
    MEDIUM: "text-blue-500",
    HIGH: "text-red-500",
  };

  const totalTasks = project.tasks?.length || 0;
  const completedTasks =
    project.tasks?.filter((t) => t.status === "COMPLETED").length || 0;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Link
      to={`/projects/${project._id}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
            {project.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
            {project.description || "No description"}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
            statusColors[project.status]
          }`}
        >
          {project.status.replace("_", " ")}
        </span>
      </div>

      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {completedTasks}/{totalTasks} Tasks
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <Users className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {project.members?.length || 0} Members
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 sm:pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {project.end_date
              ? new Date(project.end_date).toLocaleDateString()
              : "No deadline"}
          </span>
        </div>
        <span
          className={`text-xs sm:text-sm font-medium ${priorityColors[project.priority]}`}
        >
          {project.priority} Priority
        </span>
      </div>
    </Link>
  );
};

export default ProjectCard;
