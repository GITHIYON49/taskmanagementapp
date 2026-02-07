import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  GitCommit,
  MessageSquare,
  Clock,
  Bug,
  Zap,
  Square,
} from "lucide-react";
import { format } from "date-fns";

const typeIcons = {
  BUG: { icon: Bug, color: "text-red-500" },
  FEATURE: { icon: Zap, color: "text-blue-500" },
  TASK: { icon: Square, color: "text-green-500" },
  IMPROVEMENT: { icon: MessageSquare, color: "text-amber-500" },
  OTHER: { icon: GitCommit, color: "text-purple-500" },
};

const statusColors = {
  TODO: "bg-gray-200 text-gray-800",
  IN_PROGRESS: "bg-amber-200 text-amber-800",
  COMPLETED: "bg-emerald-200 text-emerald-800",
};

const RecentActivity = () => {
  const projects = useSelector((state) => state.project?.projects || []);
  const navigate = useNavigate();

  const recentTasks = useMemo(() => {
    const allTasks = projects.flatMap((project) =>
      project.tasks.map((task) => ({
        ...task,
        projectId: project.id,
      })),
    );

    return allTasks
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  }, [projects]);

  const handleTaskClick = (task) => {
    navigate(`/projects/${task.projectId}/tasks/${task.id}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg text-gray-800">Recent Activity</h2>
      </div>
      {recentTasks.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-600">No recent activity</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {recentTasks.map((task) => {
            const Icon = typeIcons[task.type]?.icon || Square;
            const iconColor = typeIcons[task.type]?.color || "text-gray-500";

            return (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-gray-800 truncate">{task.title}</h4>

                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${
                          statusColors[task.status] ||
                          "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {task.status?.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="capitalize">
                        {task.type?.toLowerCase()}
                      </span>

                      {task.assignee?.name && (
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-gray-800">
                            {task.assignee.name.charAt(0).toUpperCase()}
                          </div>
                          {task.assignee.name}
                        </div>
                      )}

                      {task.updatedAt && (
                        <span>
                          {format(new Date(task.updatedAt), "MMM d, h:mm a")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
