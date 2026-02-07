import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addTask } from "../features/projectSlice";
import { taskAPI, userAPI } from "../services/api";

const initialFormState = {
  title: "",
  description: "",
  status: "TODO",
  type: "TASK",
  priority: "MEDIUM",
  assignee: "",
  due_date: "",
};

const CreateTaskDialog = ({ showCreateTask, setShowCreateTask, projectId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.user);

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await userAPI.getAll();
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to load users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };

    if (showCreateTask) {
      loadUsers();
    }
  }, [showCreateTask]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData = {
        ...formData,
        assignee: formData.assignee?.trim() ? formData.assignee : null,
      };

      const response = await taskAPI.create(projectId, taskData);

      dispatch(
        addTask({
          projectId: projectId,
          task: response.data,
        }),
      );

      toast.success("Task created successfully!");

      if (formData.assignee && formData.assignee !== currentUser?._id) {
        const assignedUser = users.find((u) => u._id === formData.assignee);
        if (assignedUser) {
          toast.success(
            `Task assigned to ${assignedUser.name}. Email notification sent!`,
          );
        }
      }

      setShowCreateTask(false);
      setFormData(initialFormState);
    } catch (error) {
      console.error("Failed to create task:", error);
      const message = error.response?.data?.message || "Failed to create task";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showCreateTask) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 w-full max-w-2xl text-gray-900 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10"
          onClick={() => setShowCreateTask(false)}
        >
          <XIcon className="size-5" />
        </button>

        <h2 className="text-lg sm:text-xl font-semibold mb-4 pr-8">
          Create New Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 font-medium">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm h-20 sm:h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the task"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 font-medium">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TASK">Task</option>
                <option value="BUG">Bug</option>
                <option value="FEATURE">Feature</option>
                <option value="IMPROVEMENT">Improvement</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 font-medium">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Assign To
              </label>
              {loadingUsers ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-500">
                  Loading users...
                </div>
              ) : (
                <select
                  value={formData.assignee}
                  onChange={(e) => handleChange("assignee", e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  <option value={currentUser?._id}>
                    Me ({currentUser?.name})
                  </option>
                  <optgroup label="Other Users">
                    {users
                      .filter((u) => u._id !== currentUser?._id)
                      .map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                  </optgroup>
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Due Date</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => handleChange("due_date", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.due_date && (
              <p className="text-xs text-gray-500 mt-1">
                Reminder email will be sent 24 hours before due date
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2 text-sm">
            <button
              type="button"
              onClick={() => setShowCreateTask(false)}
              className="w-full sm:w-auto px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white disabled:opacity-50 hover:from-blue-600 hover:to-blue-700"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskDialog;
