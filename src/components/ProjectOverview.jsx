import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ProjectOverview = () => {
  const projects = useSelector((state) => state.project?.projects || []);
  const recentProjects = projects.slice(0, 5);

  const statusColors = {
    PLANNING: "bg-gray-200 text-gray-900",
    ACTIVE: "bg-emerald-200 text-emerald-900",
    ON_HOLD: "bg-amber-200 text-amber-900",
    COMPLETED: "bg-blue-200 text-blue-900",
    CANCELLED: "bg-red-200 text-red-900",
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
        <Link
          to="/projects"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      {recentProjects.length === 0 ? (
        <p className="py-8 text-center text-gray-500">No projects yet</p>
      ) : (
        <div className="space-y-3">
          {recentProjects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:border-gray-300"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                  {project.description || "No description"}
                </p>
              </div>
              <span
                className={`ml-4 rounded px-2 py-1 text-xs ${
                  statusColors[project.status]
                }`}
              >
                {project.status.replace("_", " ")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectOverview;
