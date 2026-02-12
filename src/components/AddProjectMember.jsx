import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addProjectMember } from "../features/projectSlice";
import { userAPI, projectAPI } from "../services/api";

const AddProjectMember = ({ projectId, onClose, onMemberAdded }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    userId: "",
    role: "MEMBER",
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await userAPI.getAll();
        setUsers(response.data || []);
      } catch (error) {
        console.error("Failed to load users:", error);
        toast.error("Failed to load users");
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId) {
      toast.error("Please select a user");
      return;
    }

    setIsSubmitting(true);

    const selectedUser = users.find((u) => u._id === formData.userId);

    try {
      if (selectedUser) {
        const optimisticMember = {
          user: selectedUser,
          role: formData.role,
          _id: `temp-${Date.now()}`,
        };

        dispatch(
          addProjectMember({
            projectId: projectId,
            member: optimisticMember,
          }),
        );

        if (onMemberAdded) {
          onMemberAdded({
            members: [optimisticMember],
          });
        }
      }

      const response = await projectAPI.addMember(
        projectId,
        formData.userId,
        formData.role,
      );

      if (onMemberAdded) {
        onMemberAdded(response.data);
      }

      toast.success(`${selectedUser.name} added to project successfully!`);
      onClose();
    } catch (error) {
      console.error("Failed to add member:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add member";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 w-full max-w-md text-gray-900 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <XIcon className="size-5" />
        </button>

        <h2 className="text-lg sm:text-xl font-semibold mb-4 pr-8">
          Add Project Member
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select User <span className="text-red-500">*</span>
            </label>
            {loadingUsers ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500">
                No users available
              </div>
            ) : (
              <select
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.role === "ADMIN"
                ? "Admins can manage project settings and members"
                : "Members can view and edit tasks"}
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.userId}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {isSubmitting ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectMember;
