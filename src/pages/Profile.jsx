import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Camera, Mail, Calendar, Save, User } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { updateUser } from "../features/authSlice";
import { authAPI } from "../services/api";
import { saveAuthData } from "../utils/authHelper";

const Profile = () => {
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
      });
    }
  }, [user?.id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        toast.success("Image selected");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    setIsSaving(true);

    try {
      const response = await authAPI.updateProfile({
        name: formData.name,
        email: formData.email,
        image: formData.image,
      });

      const { token, ...userData } = response.data;

      if (token) {
        saveAuthData(userData, token);
      } else {
        const currentToken = localStorage.getItem("token");
        saveAuthData(userData, currentToken);
      }

      dispatch(updateUser(userData));

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
      });
    }
    toast.info("Changes cancelled");
  };

  const formatJoinDate = () => {
    if (!user?.createdAt) return "N/A";

    try {
      const date = new Date(user.createdAt);

      if (isNaN(date.getTime())) {
        return "N/A";
      }

      return format(date, "MMMM yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "N/A";
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <img
                src={
                  formData.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&size=128&background=3b82f6&color=fff`
                }
                alt={formData.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500 capitalize">
                {user.role?.toLowerCase() || "Member"}
              </p>
            </div>
          </div>

          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg transition ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg transition ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Member Since
                </label>
                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                  {formatJoinDate()}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true);
                      toast.success("Edit mode enabled");
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      <Save size={16} />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCancel();
                      }}
                      disabled={isSaving}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 font-medium"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Activity Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-600 mb-1">Projects</p>
            <p className="text-2xl font-bold text-blue-600">0</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <p className="text-sm text-gray-600 mb-1">Tasks Completed</p>
            <p className="text-2xl font-bold text-green-600">0</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-sm text-gray-600 mb-1">Tasks Pending</p>
            <p className="text-2xl font-bold text-purple-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
