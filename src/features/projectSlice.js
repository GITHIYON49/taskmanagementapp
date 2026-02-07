import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    setProjects: (state, action) => {
      state.projects = action.payload;
      state.loading = false;
      state.error = null;
    },

    addProject: (state, action) => {
      state.projects.unshift(action.payload);
      state.loading = false;
    },

    updateProject: (state, action) => {
      state.projects = state.projects.map((project) =>
        String(project._id) === String(action.payload._id)
          ? action.payload
          : project,
      );
      state.loading = false;
    },

    deleteProject: (state, action) => {
      state.projects = state.projects.filter(
        (project) => String(project._id) !== String(action.payload),
      );
      state.loading = false;
    },

    addTask: (state, action) => {
      const { projectId, task } = action.payload;

      const project = state.projects.find(
        (p) => String(p._id) === String(projectId),
      );

      if (project) {
        if (!project.tasks) project.tasks = [];
        project.tasks.unshift(task); // Add to beginning
      }
    },

    updateTask: (state, action) => {
      const { projectId, taskId, updates } = action.payload;

      const project = state.projects.find(
        (p) => String(p._id) === String(projectId),
      );

      if (project && project.tasks) {
        const taskIndex = project.tasks.findIndex(
          (task) => String(task._id) === String(taskId),
        );

        if (taskIndex !== -1) {
          project.tasks[taskIndex] = {
            ...project.tasks[taskIndex],
            ...updates,
          };
        } else {
          console.error("❌ Redux: Task not found");
        }
      } else {
        console.error("❌ Redux: Project not found or has no tasks");
      }
    },

    deleteTask: (state, action) => {
      const { projectId, taskId } = action.payload;

      const project = state.projects.find(
        (p) => String(p._id) === String(projectId),
      );

      if (project && project.tasks) {
        project.tasks = project.tasks.filter(
          (task) => String(task._id) !== String(taskId),
        );
      }
    },

    addComment: (state, action) => {
      const { projectId, taskId, comment } = action.payload;

      const project = state.projects.find(
        (p) => String(p._id) === String(projectId),
      );

      if (project && project.tasks) {
        const task = project.tasks.find(
          (t) => String(t._id) === String(taskId),
        );

        if (task) {
          if (!task.comments) task.comments = [];
          task.comments.push(comment);
        }
      }
    },

    addProjectMember: (state, action) => {
      const { projectId, member } = action.payload;

      const project = state.projects.find(
        (p) => String(p._id) === String(projectId),
      );

      if (project) {
        if (!project.members) project.members = [];
        project.members.push(member);
      }
    },

    removeProjectMember: (state, action) => {
      const { projectId, userId } = action.payload;

      const project = state.projects.find(
        (p) => String(p._id) === String(projectId),
      );

      if (project && project.members) {
        project.members = project.members.filter(
          (m) => String(m.user._id) !== String(userId),
        );
      }
    },

    addAttachment: (state, action) => {
      const { projectId, taskId, attachment } = action.payload;

      const project = state.projects.find(
        (p) => String(p._id) === String(projectId),
      );

      if (project && project.tasks) {
        const task = project.tasks.find(
          (t) => String(t._id) === String(taskId),
        );

        if (task) {
          if (!task.attachments) task.attachments = [];
          task.attachments.push(attachment);
        }
      }
    },

    removeAttachment: (state, action) => {
      const { projectId, taskId, attachmentId } = action.payload;

      const project = state.projects.find(
        (p) => String(p._id) === String(projectId),
      );

      if (project && project.tasks) {
        const task = project.tasks.find(
          (t) => String(t._id) === String(taskId),
        );

        if (task && task.attachments) {
          task.attachments = task.attachments.filter(
            (a) => String(a._id) !== String(attachmentId),
          );
        }
      }
    },

    updateSingleProject: (state, action) => {
      const updatedProject = action.payload;

      const index = state.projects.findIndex(
        (p) => String(p._id) === String(updatedProject._id),
      );

      if (index !== -1) {
        state.projects[index] = updatedProject;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  addTask,
  updateTask,
  deleteTask,
  addComment,
  addProjectMember,
  removeProjectMember,
  addAttachment,
  removeAttachment,
  updateSingleProject,
} = projectSlice.actions;

export default projectSlice.reducer;
