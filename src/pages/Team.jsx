import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  UserPlus,
  Mail,
  Shield,
  User as UserIcon,
  Trash2,
  Crown,
} from "lucide-react";
import toast from "react-hot-toast";
import { userAPI } from "../services/api";

const Team = () => {
  const currentUser = useSelector((state) => state.auth?.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const canInvite = currentUser?.isTeamOwner || currentUser?.role === "ADMIN";

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await userAPI.getAll();
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to load users:", error);
        toast.error("Failed to load team members");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleRemoveMember = async (userId) => {
    if (!canInvite) {
      toast.error("Only team owner or admins can remove members");
      return;
    }

    if (!confirm("Remove this member from the team?")) return;

    try {
      await userAPI.delete(userId);
      setUsers(users.filter((u) => u._id !== userId));
      toast.success("Member removed successfully");
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove member");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Team Members
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your team and invite new members
          </p>
        </div>

        {canInvite && (
          <button
            onClick={() => setShowInviteDialog(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <UserPlus size={18} />
            Invite Member
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
              <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Total Members</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {users.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Admins</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "ADMIN").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg flex-shrink-0">
              <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Members</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "MEMBER").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            All Members
          </h2>
        </div>

        <div className="block sm:hidden divide-y divide-gray-200">
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No team members found
            </div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={
                        user.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name,
                        )}&background=3b82f6&color=fff`
                      }
                      alt={user.name}
                      className="h-10 w-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        {user.isTeamOwner && (
                          <Crown
                            className="h-4 w-4 text-amber-500 flex-shrink-0"
                            title="Team Owner"
                          />
                        )}
                        {user._id === currentUser?._id && (
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            (You)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {canInvite &&
                    !user.isTeamOwner &&
                    user._id !== currentUser?._id && (
                      <button
                        onClick={() => handleRemoveMember(user._id)}
                        className="text-red-600 hover:text-red-700 p-2 flex-shrink-0"
                        title="Remove member"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No team members found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.image ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.name,
                            )}&background=3b82f6&color=fff`
                          }
                          alt={user.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {user.name}
                            {user.isTeamOwner && (
                              <Crown
                                className="h-4 w-4 text-amber-500"
                                title="Team Owner"
                              />
                            )}
                            {user._id === currentUser?._id && (
                              <span className="text-xs text-gray-500">
                                (You)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {canInvite &&
                        !user.isTeamOwner &&
                        user._id !== currentUser?._id && (
                          <button
                            onClick={() => handleRemoveMember(user._id)}
                            className="text-red-600 hover:text-red-700"
                            title="Remove member"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showInviteDialog && (
        <InviteMemberDialog
          onClose={() => setShowInviteDialog(false)}
          onInvited={(newUser) => {
            setUsers([...users, newUser]);
            setShowInviteDialog(false);
          }}
        />
      )}
    </div>
  );
};

const InviteMemberDialog = ({ onClose, onInvited }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "MEMBER",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to invite member");
      }

      const data = await response.json();
      toast.success(`Invitation sent to ${formData.email}!`);

      if (onInvited) {
        onInvited(data);
      }

      onClose();
    } catch (error) {
      console.error("Failed to invite member:", error);
      toast.error(error.message || "Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 w-full max-w-md text-gray-900 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <UserPlus className="h-5 w-5 rotate-45" />
        </button>

        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 pr-8">
          <Mail size={20} />
          Invite Team Member
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="john@example.com"
              required
            />
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
              Admins have full access to manage projects and team
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-blue-800">
              An invitation email will be sent to{" "}
              <strong>{formData.email || "the user"}</strong> with login
              credentials and instructions to join your team.
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
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Team;
