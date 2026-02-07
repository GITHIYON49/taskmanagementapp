import { ArrowRight, Clock, AlertTriangle, User } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function TasksSummary() {
  const currentUser = useSelector((state) => state?.auth?.user || null);
  const projects = useSelector((state) => state.project?.projects || []);
  const navigate = useNavigate();

  const now = new Date();

  const allTasks = useMemo(() => {
    return projects.flatMap((project) =>
      project.tasks.map((task) => ({
        ...task,
        projectId: project.id,
      })),
    );
  }, [projects]);

  const { myTasks, overdueTasks, inProgressTasks } = useMemo(() => {
    return {
      myTasks: allTasks.filter((t) => t.assigneeId === currentUser?.id),
      overdueTasks: allTasks.filter(
        (t) =>
          t.due_date && new Date(t.due_date) < now && t.status !== "COMPLETED",
      ),
      inProgressTasks: allTasks.filter((t) => t.status === "IN_PROGRESS"),
    };
  }, [allTasks, currentUser, now]);

  const summaryCards = [
    {
      title: "My Tasks",
      count: myTasks.length,
      icon: User,
      color: "bg-emerald-100 text-emerald-800",
      items: myTasks.slice(0, 3),
    },
    {
      title: "Overdue",
      count: overdueTasks.length,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-800",
      items: overdueTasks.slice(0, 3),
    },
    {
      title: "In Progress",
      count: inProgressTasks.length,
      icon: Clock,
      color: "bg-blue-100 text-blue-800",
      items: inProgressTasks.slice(0, 3),
    },
  ];

  const handleTaskClick = (task) => {
    navigate(`/projects/${task.projectId}/tasks/${task.id}`);
  };

  return (
    <div className="space-y-6">
      {summaryCards.map((card) => (
        <div
          key={card.title}
          className="bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 rounded-lg overflow-hidden"
        >
          <div className="border-b border-gray-200 p-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <card.icon className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-center justify-between flex-1">
                <h3 className="text-sm font-medium text-gray-800">
                  {card.title}
                </h3>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${card.color}`}
                >
                  {card.count}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4">
            {card.items.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No {card.title.toLowerCase()}
              </p>
            ) : (
              <div className="space-y-3">
                {card.items.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <h4 className="text-sm font-medium text-gray-800 truncate">
                      {task.title}
                    </h4>
                    <p className="text-xs text-gray-600 capitalize mt-1">
                      {task.type} • {task.priority} priority
                    </p>
                  </div>
                ))}

                {card.count > 3 && (
                  <button className="flex items-center justify-center w-full text-sm text-gray-500 hover:text-gray-800 mt-2">
                    View {card.count - 3} more
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
