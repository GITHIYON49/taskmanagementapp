import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus } from "lucide-react";

import StatsGrid from "../components/StatsGrid";
import ProjectOverview from "../components/ProjectOverview";
import RecentActivity from "../components/RecentActivity";
import TasksSummary from "../components/TasksSummary";
import CreateProjectDialog from "../components/CreateProjectDialog";
import { setProjects } from "../features/projectSlice";
import { projectAPI } from "../services/api";

const Dashboard = () => {
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const hasLoadedRef = useRef(false);
  const renderCountRef = useRef(0);
  renderCountRef.current++;

  useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }

    const loadProjects = async () => {
      hasLoadedRef.current = true;
      setLocalLoading(true);

      try {
        const response = await projectAPI.getAll();

        const projectsData = Array.isArray(response.data) ? response.data : [];
        dispatch(setProjects(projectsData));
      } catch (error) {
        console.error("❌ Dashboard: Failed to load projects:", error);
        dispatch(setProjects([]));
        hasLoadedRef.current = false;
      } finally {
        setLocalLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (localLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h1 className="mb-1 text-xl font-semibold text-gray-900 sm:text-2xl">
            Welcome back, {user?.name || "User"}
          </h1>
          <p className="text-sm text-gray-500">
            Here's what's happening with your projects today
          </p>
        </div>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 px-5 py-2 text-sm text-white transition hover:opacity-90"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      <CreateProjectDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      <StatsGrid />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <ProjectOverview />
          <RecentActivity />
        </div>

        <div>
          <TasksSummary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
