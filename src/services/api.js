import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response Error:", error.message);

    if (error.code === "ECONNABORTED") {
      console.error("Request Timeout - Server took too long to respond");
      error.message = "Request timeout. Please try again.";
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (error.code === "ERR_NETWORK") {
      console.error("Network Error - Backend not reachable");
      error.message = "Cannot connect to server. Please check your connection.";
    }

    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  uploadImage: (formData) =>
    api.post("/auth/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  changePassword: (data) => api.put("/auth/change-password", data),
};

export const projectAPI = {
  getAll: () => api.get("/projects"),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addMember: (id, userId, role) =>
    api.post(`/projects/${id}/members`, { userId, role }),
  removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`),
};

export const taskAPI = {
  getAll: () => api.get("/tasks"),
  getOne: (id) => api.get(`/tasks/${id}`),
  create: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  share: (id, data) => api.post(`/tasks/${id}/share`, data),
  addAttachment: (id, formData) =>
    api.post(`/tasks/${id}/attachments`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  removeAttachment: (id, attachmentId) =>
    api.delete(`/tasks/${id}/attachments/${attachmentId}`),
};

export const commentAPI = {
  getAll: (taskId) => api.get(`/tasks/${taskId}/comments`),
  create: (taskId, data) => api.post(`/tasks/${taskId}/comments`, data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};

export const notificationAPI = {
  getAll: () => api.get("/notifications"),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/mark-all-read"),
};

export const userAPI = {
  getAll: () => api.get("/users"),
  getOne: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
