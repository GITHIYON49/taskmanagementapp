import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const MyTasksSidebar = () => {
  const projects = useSelector((state) => state.project?.projects || []);
  const user = useSelector((state) => state.auth?.user);

  // ✅ Get all tasks assigned to current user
  const myTasks = useMemo(() => {
    if (!projects || !Array.isArray(projects) || !user) {
      return [];
    }

    return projects.flatMap((project) => {
      // ✅ Safely check if project has tasks
      if (!project?.tasks || !Array.isArray(project.tasks)) {
        return [];
      }

      // ✅ Filter tasks assigned to current user
      return project.tasks
        .filter((task) => {
          if (!task?.assignee) return false;
          
          // Handle both populated and non-populated assignee
          const assigneeId = typeof task.assignee === 'object' 
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

  // ✅ Calculate task counts
  const taskCounts = useMemo(() => {
    return {
      total: myTasks.length,
      todo: myTasks.filter((t) => t.status === "TODO").length,
      inProgress: myTasks.filter((t) => t.status === "IN_PROGRESS").length,
      completed: myTasks.filter((t) => t.status === "COMPLETED").length,
    };
  }, [myTasks]);

  // ✅ Get upcoming tasks (sorted by due date)
  const upcomingTasks = useMemo(() => {
    return myTasks
      .filter((task) => task.due_date && task.status !== "COMPLETED")
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 5);
  }, [myTasks]);

  const statusColors = {
    TODO: "bg-gray-100 text-gray-700",
    IN_PROGRESS: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-green-100 text-green-700",
  };

  const priorityColors = {
    LOW: "text-gray-500",
    MEDIUM: "text-blue-500",
    HIGH: "text-red-500",
  };

  return (
    <div className="mt-6 px-3">
      {/* Header */}
      <div className="px-3 py-2">
        <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
          My Tasks
        </h3>
      </div>

      {/* Task Summary */}
      <div className="space-y-2 px-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total</span>
          <span className="font-semibold text-gray-900">{taskCounts.total}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-gray-400" />
            <span className="text-gray-600">To Do</span>
          </div>
          <span className="font-semibold text-gray-700">{taskCounts.todo}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-3 w-3 text-amber-500" />
            <span className="text-gray-600">In Progress</span>
          </div>
          <span className="font-semibold text-amber-600">{taskCounts.inProgress}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            <span className="text-gray-600">Completed</span>
          </div>
          <span className="font-semibold text-green-600">{taskCounts.completed}</span>
        </div>
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <>
          <div className="px-3 py-2 border-t border-gray-200">
            <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Upcoming Deadlines
            </h3>
          </div>

          <div className="space-y-1 px-3">
            {upcomingTasks.map((task) => (
              <Link
                key={task._id}
                to={`/projects/${task.projectId}/tasks/${task._id}`}
                className="block rounded-lg px-3 py-2 text-sm transition hover:bg-gray-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {task.projectName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        priorityColors[task.priority]
                      }`}
                    />
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      statusColors[task.status]
                    }`}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-gray-500">
                    {task.due_date &&
                      new Date(task.due_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* No Tasks Message */}
      {myTasks.length === 0 && (
        <div className="px-3 py-8 text-center">
          <p className="text-sm text-gray-500">No tasks assigned to you</p>
        </div>
      )}

      {/* View All Link */}
      {myTasks.length > 0 && (
        <div className="px-3 py-2 border-t border-gray-200">
          <Link
            to="/my-tasks"
            className="block text-center text-sm text-blue-600 hover:text-blue-700 py-1"
          >
            View All Tasks →
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyTasksSidebar;