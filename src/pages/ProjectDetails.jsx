import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeftIcon,
  PlusIcon,
  SettingsIcon,
  BarChart3Icon,
  CalendarIcon,
  FileStackIcon,
  ZapIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import ProjectAnalytics from "../components/ProjectAnalytics";
import ProjectSettings from "../components/ProjectSettings";
import CreateTaskDialog from "../components/CreateTaskDialog";
import ProjectCalendar from "../components/ProjectCalendar";
import ProjectTasks from "../components/ProjectTasks";
import { updateSingleProject } from "../features/projectSlice";
import { projectAPI } from "../services/api";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.project.projects || []);

  const [project, setProject] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/calendar')) return 'calendar';
    if (path.includes('/settings')) return 'settings';
    return 'tasks';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;

      setLoading(true);

      try {
        const foundProject = projects.find(
          (p) => String(p._id) === String(projectId)
        );

        if (foundProject) {
          setProject(foundProject);
          setLoading(false);
          return;
        }

        const response = await projectAPI.getOne(projectId);
        setProject(response.data);
        dispatch(updateSingleProject(response.data));
      } catch (error) {
        console.error('Failed to load project:', error);
        toast.error('Project not found');
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, projects, dispatch, navigate]);

  const tasks = project?.tasks || [];

  const statusColors = {
    PLANNING: "bg-gray-200 text-gray-900",
    ACTIVE: "bg-emerald-200 text-emerald-900",
    ON_HOLD: "bg-amber-200 text-amber-900",
    COMPLETED: "bg-blue-200 text-blue-900",
    CANCELLED: "bg-red-200 text-red-900",
  };

  const handleTabChange = (tab) => {
    const paths = {
      tasks: `/projects/${projectId}`,
      analytics: `/projects/${projectId}/analytics`,
      calendar: `/projects/${projectId}/calendar`,
      settings: `/projects/${projectId}/settings`,
    };
    navigate(paths[tab]);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProject(updatedProject);
    dispatch(updateSingleProject(updatedProject));
    toast.success('Project updated successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-center text-gray-900">
        <p className="text-2xl sm:text-3xl md:text-5xl mt-20 sm:mt-40 mb-6 sm:mb-10">
          Project not found
        </p>
        <button
          onClick={() => navigate("/projects")}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto text-gray-900">
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start justify-between">
        <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/projects")}
            className="p-1.5 sm:p-2 mt-0.5 rounded hover:bg-gray-200 text-gray-600 flex-shrink-0"
          >
            <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-xl font-medium truncate">
                {project.name}
              </h1>
              <span
                className={`px-2 py-1 rounded text-xs capitalize flex-shrink-0 ${
                  statusColors[project.status]
                }`}
              >
                {project.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateTask(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white flex-shrink-0"
        >
          <PlusIcon className="size-4" />
          <span className="whitespace-nowrap">New Task</span>
        </button>
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[
          {
            label: "Total Tasks",
            value: tasks.length,
            color: "text-gray-900",
          },
          {
            label: "Completed",
            value: tasks.filter((t) => t.status === "COMPLETED").length,
            color: "text-emerald-700",
          },
          {
            label: "In Progress",
            value: tasks.filter((t) => t.status === "IN_PROGRESS").length,
            color: "text-amber-700",
          },
          {
            label: "To Do",
            value: tasks.filter((t) => t.status === "TODO").length,
            color: "text-blue-700",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="border border-gray-200 flex flex-col sm:flex-row justify-between p-3 sm:p-4 rounded"
          >
            <div className="flex-1">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">
                {card.label}
              </div>
              <div className={`text-xl sm:text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </div>
            <ZapIcon className={`size-4 sm:size-5 mt-2 sm:mt-0 ${card.color} self-end sm:self-start`} />
          </div>
        ))}
      </div>

     
      <div>
       
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-flex min-w-full sm:min-w-0 px-4 sm:px-0 gap-1 sm:gap-2 border border-gray-200 rounded overflow-hidden">
            {[
              { key: "tasks", label: "Tasks", icon: FileStackIcon },
              { key: "calendar", label: "Calendar", icon: CalendarIcon },
              { key: "analytics", label: "Analytics", icon: BarChart3Icon },
              { key: "settings", label: "Settings", icon: SettingsIcon },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => handleTabChange(item.key)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap transition ${
                  activeTab === item.key ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <item.icon className="size-3 sm:size-3.5 flex-shrink-0" />
                <span className="hidden xs:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        
        <div className="mt-4 sm:mt-6">
          {activeTab === "tasks" && (
            <ProjectTasks tasks={tasks} projectId={projectId} />
          )}

          {activeTab === "calendar" && (
            <ProjectCalendar tasks={tasks} projectId={projectId} />
          )}

          {activeTab === "analytics" && (
            <ProjectAnalytics tasks={tasks} project={project} />
          )}

          {activeTab === "settings" && (
            <ProjectSettings 
              project={project} 
              onProjectUpdated={handleProjectUpdated}
            />
          )}
        </div>
      </div>

      
      {showCreateTask && (
        <CreateTaskDialog
          showCreateTask={showCreateTask}
          setShowCreateTask={setShowCreateTask}
          projectId={projectId}
        />
      )}
    </div>
  );
}