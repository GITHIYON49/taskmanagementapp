import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Search, FolderOpen } from "lucide-react";
import toast from "react-hot-toast";

import ProjectCard from "../components/ProjectCard";
import CreateProjectDialog from "../components/CreateProjectDialog";
import { setProjects } from "../features/projectSlice";
import { projectAPI } from "../services/api";

export default function Projects() {
  const projects = useSelector((state) => state.project?.projects || []);
  const dispatch = useDispatch();

  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "ALL",
    priority: "ALL",
  });
  const [localLoading, setLocalLoading] = useState(true);

  const hasLoadedRef = useRef(false);
  const renderCountRef = useRef(0);

  useEffect(() => {
    if (hasLoadedRef.current) {
      setLocalLoading(false);
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
        console.error("❌ Projects: Error loading:", error);
        dispatch(setProjects([]));
        toast.error("Failed to load projects");
        hasLoadedRef.current = false;
      } finally {
        setLocalLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = [...projects];

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filters.status !== "ALL") {
      filtered = filtered.filter(
        (project) => project.status === filters.status,
      );
    }

    if (filters.priority !== "ALL") {
      filtered = filtered.filter(
        (project) => project.priority === filters.priority,
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, filters]);

  if (localLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h1 className="mb-1 text-xl font-semibold text-gray-900 sm:text-2xl">
            Projects
          </h1>
          <p className="text-sm text-gray-500">
            Manage and track your projects ({projects.length} total)
          </p>
        </div>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center rounded bg-gradient-to-br from-blue-500 to-blue-600 px-5 py-2 text-sm text-white transition hover:opacity-90"
        >
          <Plus className="mr-2 size-4" />
          New Project
        </button>
      </div>

      <CreateProjectDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PLANNING">Planning</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="ALL">All Priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
              <FolderOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              No projects found
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              {projects.length === 0
                ? "Create your first project to get started"
                : "No projects match your search criteria"}
            </p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="mx-auto flex items-center gap-1.5 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 transition"
            >
              <Plus className="size-4" />
              Create Project
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
