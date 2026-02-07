import { Link } from "react-router-dom";

const statusColors = {
  PLANNING: "bg-gray-200 text-gray-900",
  ACTIVE: "bg-emerald-200 text-emerald-900",
  ON_HOLD: "bg-amber-200 text-amber-900",
  COMPLETED: "bg-blue-200 text-blue-900",
  CANCELLED: "bg-red-200 text-red-900",
};

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg p-5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-blue-500 transition-colors">
            {project.name}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">
            {project.description || "No description"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            statusColors[project.status]
          }`}
        >
          {project.status.replace("_", " ")}
        </span>
        <span className="text-xs text-gray-500 capitalize">
          {project.priority} priority
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Progress</span>
          <span className="text-gray-400">{project.progress || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 h-1.5 rounded">
          <div
            className="h-1.5 rounded bg-blue-500"
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
