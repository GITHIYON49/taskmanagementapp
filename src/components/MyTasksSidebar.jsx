import { useState, useMemo } from "react";
import {
  CheckSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function MyTasksSidebar() {
  const user = useSelector((state) => state.auth?.user);
  const projects = useSelector((state) => state.project?.projects || []);

  const [showMyTasks, setShowMyTasks] = useState(false);

  const toggleMyTasks = () => setShowMyTasks((prev) => !prev);

  const getTaskStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500";
      case "IN_PROGRESS":
        return "bg-yellow-500";
      case "TODO":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const myTasks = useMemo(() => {
    return projects.flatMap((project) =>
      project.tasks
        .filter((task) => task.assigneeId === user?.id)
        .map((task) => ({
          ...task,
          projectId: project.id,
        })),
    );
  }, [projects, user]);

  return (
    <div className="mt-6 px-3">
      <div
        onClick={toggleMyTasks}
        className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-100"
      >
        <div className="flex items-center gap-2">
          <CheckSquareIcon className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700">My Tasks</h3>
          <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
            {myTasks.length}
          </span>
        </div>

        {showMyTasks ? (
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
        )}
      </div>

      {showMyTasks && (
        <div className="mt-2 space-y-1 pl-2">
          {myTasks.length === 0 ? (
            <div className="px-3 py-2 text-center text-xs text-gray-500">
              No tasks assigned
            </div>
          ) : (
            myTasks.map((task) => (
              <Link
                key={task.id}
                to={`/projects/${task.projectId}/tasks/${task.id}`}
                className="block rounded-lg transition hover:bg-gray-100 hover:text-black"
              >
                <div className="flex min-w-0 items-center gap-2 px-3 py-2">
                  <div
                    className={`h-2 w-2 rounded-full ${getTaskStatusColor(
                      task.status,
                    )}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{task.title}</p>
                    <p className="text-xs text-gray-500 lowercase">
                      {task.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MyTasksSidebar;
