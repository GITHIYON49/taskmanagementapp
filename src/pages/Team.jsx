import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { UserPlus, Mail, Shield, User as UserIcon, Trash2, Crown } from "lucide-react";
import toast from "react-hot-toast";
import { userAPI } from "../services/api";

const Team = () => {
  const currentUser = useSelector((state) => state.auth?.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // ✅ Check if current user can invite
  const canInvite = currentUser?.isTeamOwner || currentUser?.role === 'ADMIN';

  // Load all users
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await userAPI.getAll();
        console.log("✅ Users loaded:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("❌ Failed to load users:", error);
        toast.error("Failed to load team members");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleRemoveMember = async (userId) => {
    // ✅ Only team owner can remove members
    if (!canInvite) {
      toast.error("Only team owner or admins can remove members");
      return;
    }

    if (!confirm("Remove this member from the team?")) return;

    try {
      await userAPI.delete(userId);
      setUsers(users.filter(u => u._id !== userId));
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">
            Manage your team and invite new members
          </p>
        </div>

        {canInvite && (
          <button
            onClick={() => setShowInviteDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <UserPlus size={18} />
            Invite Member
          </button>
        )}
      </div>

      {/* Show message if not authorized to invite */}
      {!canInvite && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            Only the team owner or admins can invite new members.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "ADMIN").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "MEMBER").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Members</h2>
        </div>

        <div className="overflow-x-auto">
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
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
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
                              user.name
                            )}&background=3b82f6&color=fff`
                          }
                          alt={user.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {user.name}
                            {user.isTeamOwner && (
                              <Crown className="h-4 w-4 text-amber-500" title="Team Owner" />
                            )}
                            {user._id === currentUser?._id && (
                              <span className="text-xs text-gray-500">(You)</span>
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

      {/* Invite Dialog */}
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

// InviteMemberDialog component stays the same...
// (Keep the existing InviteMemberDialog component code)

export default Team;