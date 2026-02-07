import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Trash2, UserPlus, UserMinus, Save } from "lucide-react";
import toast from "react-hot-toast";
import { updateProject, deleteProject } from "../features/projectSlice";
import { projectAPI } from "../services/api";
import AddProjectMember from "./AddProjectMember";

const ProjectSettings = ({ project, onProjectUpdated }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: project.name || "",
    description: project.description || "",
    status: project.status || "PLANNING",
    priority: project.priority || "MEDIUM",
    start_date: project.start_date ? project.start_date.split("T")[0] : "",
    end_date: project.end_date ? project.end_date.split("T")[0] : "",
    progress: project.progress || 0,
  });

  const [showAddMember, setShowAddMember] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setIsSaving(true);

    try {
      const response = await projectAPI.update(project._id, formData);

      dispatch(updateProject(response.data));

      if (onProjectUpdated) {
        onProjectUpdated(response.data);
      }

      toast.success("Project updated successfully!");
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error(error.response?.data?.message || "Failed to update project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await projectAPI.delete(project._id);

      dispatch(deleteProject(project._id));

      toast.success("Project deleted successfully!");
      navigate("/projects");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!memberId) {
      toast.error("Invalid member ID");
      return;
    }

    if (!confirm("Remove this member from the project?")) {
      return;
    }

    try {
      const response = await projectAPI.removeMember(project._id, memberId);

      if (onProjectUpdated) {
        onProjectUpdated(response.data);
      }

      toast.success("Member removed successfully!");
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      console.error("Error status:", error.response?.status);

      const errorMessage =
        error.response?.data?.message || "Failed to remove member";
      toast.error(errorMessage);
    }
  };

  const handleMemberAdded = (updatedProject) => {
    if (onProjectUpdated) {
      onProjectUpdated(updatedProject);
    }

    toast.success("Member added successfully!");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Project Details
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress: {formData.progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) =>
                handleChange("progress", parseInt(e.target.value))
              }
              className="w-full"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          <button
            onClick={() => setShowAddMember(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus size={16} />
            Add Member
          </button>
        </div>

        <div className="space-y-2">
          {!project.members || project.members.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No members yet</p>
          ) : (
            project.members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      member.user?.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.user?.name || "User",
                      )}&background=3b82f6&color=fff`
                    }
                    alt={member.user?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.user?.name || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {member.user?.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{member.role}</span>
                  {member.role !== "ADMIN" &&
                    project.createdBy?._id !== member.user?._id && (
                      <button
                        onClick={() => handleRemoveMember(member.user?._id)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                        title="Remove member"
                      >
                        <UserMinus size={16} />
                      </button>
                    )}
                  {member.role === "ADMIN" && (
                    <span className="text-xs text-gray-400">
                      (Cannot remove)
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h2>
        <p className="text-sm text-red-700 mb-4">
          Once you delete a project, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Trash2 size={16} />
          Delete Project
        </button>
      </div>

      {showAddMember && (
        <AddProjectMember
          projectId={project._id}
          onClose={() => setShowAddMember(false)}
          onMemberAdded={handleMemberAdded}
        />
      )}
    </div>
  );
};

export default ProjectSettings;
