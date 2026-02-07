import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addProjectMember } from "../features/projectSlice";
import { userAPI, projectAPI } from "../services/api";

const AddProjectMember = ({ projectId, onClose, onMemberAdded }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await userAPI.getAll();
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to load users:", error);
        toast.error("Failed to load users");
      }
    };
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    setIsAdding(true);

    try {
      const response = await projectAPI.addMember(
        projectId,
        selectedUser,
        role,
      );

      const addedMember = response.data.members.find(
        (m) => m.user._id === selectedUser,
      );

      if (addedMember) {
        dispatch(
          addProjectMember({
            projectId: projectId,
            member: addedMember,
          }),
        );
      }

      if (onMemberAdded) {
        onMemberAdded(response.data);
      }

      const userName = users.find((u) => u._id === selectedUser)?.name;
      toast.success(`${userName} added to project! Email notification sent.`);

      onClose();
    } catch (error) {
      console.error("Failed to add member:", error);
      toast.error(error.response?.data?.message || "Failed to add member");
    } finally {
      setIsAdding(false);
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

        <h2 className="text-xl font-semibold mb-4">Add Team Member</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select a user --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Admins can edit project settings and manage members
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isAdding}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding || !selectedUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isAdding ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectMember;
