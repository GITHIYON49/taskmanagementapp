import { useState, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronRightIcon,
  SettingsIcon,
  KanbanIcon,
  ChartColumnIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "lucide-react";
import { useSelector } from "react-redux";

const ProjectSidebar = memo(({ onLinkClick }) => {
  const location = useLocation();
  const [expandedProjects, setExpandedProjects] = useState(new Set());

  const projects = useSelector((state) => state.project?.projects || []);

  const getProjectSubItems = (projectId) => [
    { title: "Tasks", icon: KanbanIcon, path: `/projects/${projectId}` },
    {
      title: "Analytics",
      icon: ChartColumnIcon,
      path: `/projects/${projectId}/analytics`,
    },
    {
      title: "Calendar",
      icon: CalendarIcon,
      path: `/projects/${projectId}/calendar`,
    },
    {
      title: "Settings",
      icon: SettingsIcon,
      path: `/projects/${projectId}/settings`,
    },
  ];

  const toggleProject = (id) => {
    const next = new Set(expandedProjects);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedProjects(next);
  };

  return (
    <div className="mt-4 sm:mt-6 px-2 sm:px-3">
      <div className="flex items-center justify-between px-2 sm:px-3 py-2">
        <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Projects
        </h3>

        <Link to="/projects" onClick={onLinkClick}>
          <button className="flex size-5 sm:size-6 items-center justify-center rounded text-gray-500 transition hover:bg-gray-100 hover:text-gray-900">
            <ArrowRightIcon className="size-3" />
          </button>
        </Link>
      </div>

      <div className="space-y-1 px-2 sm:px-3">
        {projects.slice(0, 5).map((project) => (
          <div key={project._id}>
            <button
              onClick={() => toggleProject(project._id)}
              className="flex w-full items-center gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <ChevronRightIcon
                className={`size-3 text-gray-500 transition-transform flex-shrink-0 ${
                  expandedProjects.has(project._id) ? "rotate-90" : ""
                }`}
              />

              <div className="size-2 shrink-0 rounded-full bg-blue-500" />

              <span className="flex-1 truncate text-left">{project.name}</span>
            </button>

            {expandedProjects.has(project._id) && (
              <div className="ml-4 sm:ml-5 mt-1 space-y-1">
                {getProjectSubItems(project._id).map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.title}
                      to={item.path}
                      onClick={onLinkClick}
                      className={`flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs transition
                        ${
                          isActive
                            ? "bg-blue-100 text-blue-600"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                      <item.icon className="size-3 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

ProjectSidebar.displayName = "ProjectSidebar";

export default ProjectSidebar;
