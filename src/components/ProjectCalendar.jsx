import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  format,
  isSameDay,
  isBefore,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import {
  CalendarIcon,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const typeColors = {
  BUG: "bg-red-200 text-red-800",
  FEATURE: "bg-blue-200 text-blue-800",
  TASK: "bg-green-200 text-green-800",
  IMPROVEMENT: "bg-purple-200 text-purple-800",
  OTHER: "bg-amber-200 text-amber-800",
};

const priorityBorders = {
  LOW: "border-gray-300",
  MEDIUM: "border-amber-300",
  HIGH: "border-orange-300",
};

const ProjectCalendar = ({ tasks, projectId }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();

  const getTasksForDate = (date) =>
    tasks.filter(
      (task) => task.due_date && isSameDay(new Date(task.due_date), date),
    );

  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.due_date &&
        !isBefore(new Date(task.due_date), today) &&
        task.status !== "COMPLETED",
    )
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  const overdueTasks = tasks.filter(
    (task) =>
      task.due_date &&
      isBefore(new Date(task.due_date), today) &&
      task.status !== "COMPLETED",
  );

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleMonthChange = (direction) => {
    setCurrentMonth((prev) =>
      direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1),
    );
  };

  const handleTaskClick = (taskId) => {
    navigate(`/projects/${projectId}/tasks/${taskId}`);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900 text-md flex gap-2 items-center max-sm:hidden">
              <CalendarIcon className="size-5" />
              Task Calendar
            </h2>

            <div className="flex gap-2 items-center">
              <button onClick={() => handleMonthChange("prev")}>
                <ChevronLeft className="size-5 text-gray-600 hover:text-gray-900" />
              </button>
              <span className="text-gray-900">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <button onClick={() => handleMonthChange("next")}>
                <ChevronRight className="size-5 text-gray-600 hover:text-gray-900" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-xs text-gray-600 mb-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const dayTasks = getTasksForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const hasOverdue = dayTasks.some(
                (t) =>
                  t.status !== "COMPLETED" &&
                  isBefore(new Date(t.due_date), today),
              );

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`sm:h-14 rounded-md flex flex-col items-center justify-center text-sm
                    ${
                      isSelected
                        ? "bg-blue-200 text-blue-900"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                    }
                    ${hasOverdue ? "border border-red-300" : ""}`}
                >
                  <span>{format(day, "d")}</span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] text-blue-700">
                      {dayTasks.length} tasks
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {getTasksForDate(selectedDate).length > 0 && (
          <div className="bg-white mt-6 border border-gray-300 rounded-lg p-4">
            <h3 className="text-gray-900 text-lg mb-3">
              Tasks for {format(selectedDate, "MMM d, yyyy")}
            </h3>

            <div className="space-y-3">
              {getTasksForDate(selectedDate).map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task.id)}
                  className={`bg-gray-50 hover:bg-gray-100 transition p-4 rounded border-l-4 cursor-pointer ${
                    priorityBorders[task.priority]
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <h4 className="text-gray-900 font-medium">{task.title}</h4>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        typeColors[task.type]
                      }`}
                    >
                      {task.type}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600">
                    <span className="capitalize">
                      {task.priority.toLowerCase()} priority
                    </span>
                    {task.assignee && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {task.assignee.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="space-y-6">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <h3 className="text-gray-900 text-sm flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" />
            Upcoming Tasks
          </h3>

          {upcomingTasks.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">
              No upcoming tasks
            </p>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task.id)}
                  className="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition cursor-pointer"
                >
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-gray-900">{task.title}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        typeColors[task.type]
                      }`}
                    >
                      {task.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {format(new Date(task.due_date), "MMM d")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        {overdueTasks.length > 0 && (
          <div className="bg-white border border-red-300 border-l-4 rounded-lg p-4">
            <h3 className="text-red-700 text-sm flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4" />
              Overdue Tasks ({overdueTasks.length})
            </h3>

            <div className="space-y-2">
              {overdueTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task.id)}
                  className="bg-red-50 hover:bg-red-100 p-3 rounded-lg transition cursor-pointer"
                >
                  <div className="flex justify-between text-sm text-gray-900">
                    <span>{task.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-200 text-red-900">
                      {task.type}
                    </span>
                  </div>
                  <p className="text-xs text-red-600">
                    Due {format(new Date(task.due_date), "MMM d")}
                  </p>
                </div>
              ))}

              {overdueTasks.length > 5 && (
                <p className="text-xs text-gray-500 text-center">
                  +{overdueTasks.length - 5} more
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCalendar;
