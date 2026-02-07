import { useState, useEffect } from "react";
import { XIcon, Mail } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { userAPI, taskAPI } from "../services/api";

const ShareTaskDialog = ({ task, onClose }) => {
  const currentUser = useSelector((state) => state.auth?.user);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [permission, setPermission] = useState("view");
  const [message, setMessage] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await userAPI.getAll();

        const filteredUsers = response.data.filter(
          (u) => u._id !== currentUser?._id && u._id !== task.assignee?._id,
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };
    loadUsers();
  }, [currentUser, task]);

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleShare = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    setIsSharing(true);

    try {
      const response = await taskAPI.share(task._id, {
        userIds: selectedUsers,
        permission: permission,
        message: message,
      });

      toast.success(
        `Task shared with ${response.data.sharedWith.length} user(s)! Email notifications sent.`,
      );

      onClose();
    } catch (error) {
      console.error("❌ Failed to share task:", error);
      toast.error(error.response?.data?.message || "Failed to share task");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-md text-gray-900 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <XIcon className="size-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Mail size={20} />
          Share Task
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Users
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-2">
              {users.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No other users available
                </p>
              ) : (
                users.map((user) => (
                  <label
                    key={user._id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleUserToggle(user._id)}
                      className="rounded"
                    />
                    <img
                      src={
                        user.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name,
                        )}&background=3b82f6&color=fff`
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Permission Level
            </label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="view">View Only</option>
              <option value="edit">Can Edit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message to include in the email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isSharing}
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              disabled={isSharing || selectedUsers.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSharing
                ? "Sharing..."
                : `Share with ${selectedUsers.length} user(s)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareTaskDialog;
