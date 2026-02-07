import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  Calendar,
  User,
  Paperclip,
  Download,
  Trash2,
  MessageSquare,
  Share2,
  Edit,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

import ShareTaskDialog from "../components/ShareTaskDialog";
import EditTaskDialog from "../components/EditTaskDialog";
import {
  addComment,
  addAttachment,
  removeAttachment,
} from "../features/projectSlice";
import { taskAPI, commentAPI } from "../services/api";

const TaskDetails = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.user);
  const projects = useSelector((state) => state.project?.projects || []);

  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      if (!projectId || !taskId) return;

      setLoading(true);

      try {
        const foundProject = projects.find(
          (p) => String(p._id) === String(projectId),
        );

        if (foundProject) {
          const foundTask = foundProject.tasks?.find(
            (t) => String(t._id) === String(taskId),
          );

          if (foundTask) {
            setTask(foundTask);
            setProject(foundProject);
            setLoading(false);
            return;
          }
        }

        const response = await taskAPI.getOne(taskId);

        setTask(response.data);

        if (response.data.project) {
          setProject(response.data.project);
        }

        if (response.data.comments) {
          setComments(response.data.comments);
        }
      } catch (error) {
        console.error("❌ Failed to load task:", error);
        toast.error("Task not found");
        navigate(`/projects/${projectId}`);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [projectId, taskId, projects, navigate]);

  useEffect(() => {
    if (!taskId) return;

    const loadComments = async () => {
      try {
        const response = await commentAPI.getAll(taskId);
        setComments(response.data);
      } catch (error) {
        console.error("❌ Failed to load comments:", error);
      }
    };

    loadComments();
  }, [taskId]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await commentAPI.create(taskId, {
        content: newComment,
      });

      setComments([response.data, ...comments]);

      dispatch(
        addComment({
          projectId: projectId,
          taskId: taskId,
          comment: response.data,
        }),
      );

      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      console.error("❌ Failed to add comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await taskAPI.addAttachment(taskId, formData);

      setTask(response.data);

      dispatch(
        addAttachment({
          projectId: projectId,
          taskId: taskId,
          attachment:
            response.data.attachments[response.data.attachments.length - 1],
        }),
      );

      toast.success("File uploaded!");
    } catch (error) {
      console.error("❌ Failed to upload file:", error);
      toast.error("Failed to upload file");
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!confirm("Delete this attachment?")) return;

    try {
      const response = await taskAPI.removeAttachment(taskId, attachmentId);

      setTask(response.data);

      dispatch(
        removeAttachment({
          projectId: projectId,
          taskId: taskId,
          attachmentId: attachmentId,
        }),
      );

      toast.success("Attachment deleted!");
    } catch (error) {
      console.error("❌ Failed to delete attachment:", error);
      toast.error("Failed to delete attachment");
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTask(updatedTask);
    toast.success("Task updated successfully!");
  };

  const statusColors = {
    TODO: "bg-gray-100 text-gray-700",
    IN_PROGRESS: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-green-100 text-green-700",
  };

  const priorityColors = {
    LOW: "bg-gray-100 text-gray-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-red-100 text-red-700",
  };

  const typeColors = {
    TASK: "bg-blue-100 text-blue-700",
    BUG: "bg-red-100 text-red-700",
    FEATURE: "bg-green-100 text-green-700",
    IMPROVEMENT: "bg-purple-100 text-purple-700",
    OTHER: "bg-gray-100 text-gray-700",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6 text-center text-gray-900">
        <p className="text-3xl md:text-5xl mt-40 mb-10">Task not found</p>
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="mt-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Back to Project
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="mt-1 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {task.title}
            </h1>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}
              >
                {task.status.replace("_", " ")}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${typeColors[task.type]}`}
              >
                {task.type}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}
              >
                {task.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowEditDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => setShowShareDialog(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {task.description || "No description provided"}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              Comments ({comments.length})
            </h2>

            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex gap-3">
                <img
                  src={
                    user?.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User",
                    )}&background=3b82f6&color=fff`
                  }
                  alt={user?.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                  />
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <img
                      src={
                        comment.user?.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          comment.user?.name || "User",
                        )}&background=3b82f6&color=fff`
                      }
                      alt={comment.user?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {comment.user?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {comment.createdAt
                              ? format(
                                  new Date(comment.createdAt),
                                  "MMM d, yyyy 'at' h:mm a",
                                )
                              : "Just now"}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Paperclip size={20} />
              Attachments ({task.attachments?.length || 0})
            </h2>

            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer mb-4">
              <Paperclip size={16} />
              Upload File
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="space-y-2">
              {!task.attachments || task.attachments.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  No attachments yet
                </p>
              ) : (
                task.attachments.map((attachment) => (
                  <div
                    key={attachment._id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(attachment.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`http://localhost:5000${attachment.url}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Download size={16} />
                      </a>
                      <button
                        onClick={() => handleDeleteAttachment(attachment._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                  <User size={16} />
                  Assignee
                </label>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        task.assignee.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          task.assignee.name,
                        )}&background=3b82f6&color=fff`
                      }
                      alt={task.assignee.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {task.assignee.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.assignee.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Unassigned</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                  <Calendar size={16} />
                  Due Date
                </label>
                <p className="text-sm text-gray-900">
                  {task.due_date
                    ? format(new Date(task.due_date), "MMM d, yyyy")
                    : "No due date"}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">
                  Created
                </label>
                <p className="text-sm text-gray-900">
                  {task.createdAt
                    ? format(new Date(task.createdAt), "MMM d, yyyy")
                    : "Unknown"}
                </p>
                {task.createdBy && (
                  <p className="text-xs text-gray-500 mt-1">
                    by {task.createdBy.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {project && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Project
              </h2>
              <button
                onClick={() => navigate(`/projects/${projectId}`)}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <p className="font-medium text-gray-900">
                  {project.name || "Unknown Project"}
                </p>
                {project.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {showShareDialog && (
        <ShareTaskDialog
          task={task}
          onClose={() => setShowShareDialog(false)}
        />
      )}

      {showEditDialog && (
        <EditTaskDialog
          task={task}
          projectId={projectId}
          onClose={() => setShowEditDialog(false)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
};

export default TaskDetails;
