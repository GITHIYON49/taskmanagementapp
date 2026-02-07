import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Bug,
  Zap,
  CheckCircle2,
  Code,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { updateTask, deleteTask } from "../features/projectSlice";
import { taskAPI } from "../services/api";

export default function ProjectTasks({ tasks = [], projectId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    status: "ALL",
    type: "ALL",
    priority: "ALL",
  });
  const [selectedTasks, setSelectedTasks] = useState(new Set());

  const filteredTasks = tasks.filter((task) => {
    if (filters.status !== "ALL" && task.status !== filters.status)
      return false;
    if (filters.type !== "ALL" && task.type !== filters.type) return false;
    if (filters.priority !== "ALL" && task.priority !== filters.priority)
      return false;
    return true;
  });

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await taskAPI.update(taskId, { status: newStatus });

      dispatch(
        updateTask({
          projectId: projectId,
          taskId: taskId,
          updates: response.data,
        }),
      );

      toast.success("Task status updated!");
    } catch (error) {
      console.error("❌ Failed to update task:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0) {
      toast.error("No tasks selected");
      return;
    }

    if (!confirm(`Delete ${selectedTasks.size} task(s)?`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedTasks).map(async (taskId) => {
        await taskAPI.delete(taskId);
        dispatch(deleteTask({ projectId, taskId }));
      });

      await Promise.all(deletePromises);

      toast.success(`${selectedTasks.size} task(s) deleted`);
      setSelectedTasks(new Set());
    } catch (error) {
      console.error("❌ Failed to delete tasks:", error);
      toast.error("Failed to delete some tasks");
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Delete this task?")) return;

    try {
      await taskAPI.delete(taskId);
      dispatch(deleteTask({ projectId, taskId }));
      toast.success("Task deleted");
    } catch (error) {
      console.error("❌ Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  const toggleTaskSelection = (taskId) => {
    const newSelection = new Set(selectedTasks);
    if (newSelection.has(taskId)) {
      newSelection.delete(taskId);
    } else {
      newSelection.add(taskId);
    }
    setSelectedTasks(newSelection);
  };

  const typeIcons = {
    BUG: Bug,
    TASK: CheckCircle2,
    FEATURE: Zap,
    IMPROVEMENT: Code,
    OTHER: MoreHorizontal,
  };

  const priorityColors = {
    LOW: "bg-gray-100 text-gray-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-red-100 text-red-700",
  };

  const statusColors = {
    TODO: "bg-gray-100 text-gray-700",
    IN_PROGRESS: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Types</option>
          <option value="TASK">Task</option>
          <option value="BUG">Bug</option>
          <option value="FEATURE">Feature</option>
          <option value="IMPROVEMENT">Improvement</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <button
          onClick={() =>
            setFilters({ status: "ALL", type: "ALL", priority: "ALL" })
          }
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Reset
        </button>

        {selectedTasks.size > 0 && (
          <button
            onClick={handleBulkDelete}
            className="ml-auto flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            <Trash2 className="size-4" />
            Delete ({selectedTasks.size})
          </button>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-10 p-3">
                <input
                  type="checkbox"
                  checked={
                    filteredTasks.length > 0 &&
                    selectedTasks.size === filteredTasks.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTasks(
                        new Set(filteredTasks.map((t) => t._id)),
                      );
                    } else {
                      setSelectedTasks(new Set());
                    }
                  }}
                  className="rounded"
                />
              </th>
              <th className="text-left p-3 text-sm font-medium text-gray-700">
                Title
              </th>
              <th className="text-left p-3 text-sm font-medium text-gray-700">
                Type
              </th>
              <th className="text-left p-3 text-sm font-medium text-gray-700">
                Priority
              </th>
              <th className="text-left p-3 text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="text-left p-3 text-sm font-medium text-gray-700">
                Assignee
              </th>
              <th className="text-left p-3 text-sm font-medium text-gray-700">
                Due Date
              </th>
              <th className="w-10 p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const TypeIcon = typeIcons[task.type] || CheckCircle2;

                return (
                  <tr
                    key={task._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/projects/${projectId}/tasks/${task._id}`)
                    }
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedTasks.has(task._id)}
                        onChange={() => toggleTaskSelection(task._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900">
                      {task.title}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TypeIcon className="size-4" />
                        {task.type}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          priorityColors[task.priority]
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                        className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${
                          statusColors[task.status]
                        }`}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {task.assignee?.name || "Unassigned"}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
