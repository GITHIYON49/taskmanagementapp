import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
} from "lucide-react";

const MyTasks = () => {
  const navigate = useNavigate();
  const projects = useSelector((state) => state.project?.projects || []);
  const user = useSelector((state) => state.auth?.user);

  const [filter, setFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const myTasks = useMemo(() => {
    if (!projects || !Array.isArray(projects) || !user) {
      return [];
    }

    return projects.flatMap((project) => {
      if (!project?.tasks || !Array.isArray(project.tasks)) {
        return [];
      }

      return project.tasks
        .filter((task) => {
          if (!task?.assignee) return false;

          const assigneeId =
            typeof task.assignee === "object"
              ? task.assignee._id
              : task.assignee;

          return assigneeId?.toString() === user._id?.toString();
        })
        .map((task) => ({
          ...task,
          projectId: project._id,
          projectName: project.name,
        }));
    });
  }, [projects, user]);

  const filteredTasks = useMemo(() => {
    if (filter === "ALL") return myTasks;
    return myTasks.filter((task) => task.status === filter);
  }, [myTasks, filter]);

  const statusColors = {
    TODO: "bg-gray-100 text-gray-700",
    IN_PROGRESS: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-green-100 text-green-700",
  };

  const priorityColors = {
    LOW: "bg-gray-100 text-gray-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          My Tasks
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          All tasks assigned to you across projects
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Total Tasks</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {myTasks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-gray-100 rounded-lg flex-shrink-0">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">To Do</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {myTasks.filter((t) => t.status === "TODO").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-amber-100 rounded-lg flex-shrink-0">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">In Progress</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {myTasks.filter((t) => t.status === "IN_PROGRESS").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {myTasks.filter((t) => t.status === "COMPLETED").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Filter className="h-4 w-4" />
          Filter by Status
          {filter !== "ALL" && (
            <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
              {filter.replace("_", " ")}
            </span>
          )}
        </button>

        <div
          className={`${showFilters ? "flex" : "hidden"} sm:flex flex-col sm:flex-row items-center gap-2 sm:gap-4`}
        >
          <Filter className="hidden sm:block h-5 w-5 text-gray-400 flex-shrink-0" />
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {["ALL", "TODO", "IN_PROGRESS", "COMPLETED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {status === "ALL" ? "All Tasks" : status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <button
                key={task._id}
                onClick={() =>
                  navigate(`/projects/${task.projectId}/tasks/${task._id}`)
                }
                className="w-full p-4 sm:p-6 text-left hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base break-words">
                      {task.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                      {task.description || "No description"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-500">
                        📁 {task.projectName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          statusColors[task.status]
                        }`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          priorityColors[task.priority]
                        }`}
                      >
                        {task.priority}
                      </span>
                      {task.due_date && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          Due {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
