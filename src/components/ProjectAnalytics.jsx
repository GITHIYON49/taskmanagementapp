import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  ArrowRightIcon,
} from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const PRIORITY_COLORS = {
  LOW: "bg-red-500",
  MEDIUM: "bg-blue-500",
  HIGH: "bg-emerald-500",
};

const ProjectAnalytics = ({ project, tasks }) => {
  const { stats, statusData, typeData, priorityData } = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const now = new Date();
    const total = safeTasks.length;

    const stats = {
      total,
      completed: 0,
      inProgress: 0,
      todo: 0,
      overdue: 0,
    };

    const statusMap = { TODO: 0, IN_PROGRESS: 0, COMPLETED: 0 };
    const typeMap = {
      TASK: 0,
      BUG: 0,
      FEATURE: 0,
      IMPROVEMENT: 0,
      OTHER: 0,
    };
    const priorityMap = { LOW: 0, MEDIUM: 0, HIGH: 0 };

    safeTasks.forEach((t) => {
      if (t.status === "COMPLETED") stats.completed++;
      if (t.status === "IN_PROGRESS") stats.inProgress++;
      if (t.status === "TODO") stats.todo++;

      if (
        t.due_date &&
        new Date(t.due_date) < now &&
        t.status !== "COMPLETED"
      ) {
        stats.overdue++;
      }

      if (statusMap[t.status] !== undefined) statusMap[t.status]++;
      if (typeMap[t.type] !== undefined) typeMap[t.type]++;
      if (priorityMap[t.priority] !== undefined) priorityMap[t.priority]++;
    });

    return {
      stats,
      statusData: Object.entries(statusMap).map(([k, v]) => ({
        name: k.replace("_", " ").toLowerCase(),
        value: v,
      })),
      typeData: Object.entries(typeMap)
        .filter(([_, v]) => v > 0)
        .map(([k, v]) => ({
          name: k.toLowerCase(),
          value: v,
        })),
      priorityData: Object.entries(priorityMap).map(([k, v]) => ({
        name: k,
        value: v,
        percentage: total ? Math.round((v / total) * 100) : 0,
      })),
    };
  }, [tasks]);

  const completionRate = stats.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const metrics = [
    {
      label: "Completion Rate",
      value: stats.total ? `${completionRate}%` : "—",
      icon: <CheckCircle className="size-5 text-emerald-600" />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Active Tasks",
      value: stats.inProgress,
      icon: <Clock className="size-5 text-blue-600" />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Overdue Tasks",
      value: stats.overdue,
      icon: <AlertTriangle className="size-5 text-red-600" />,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      label: "Team Size",
      value: project?.members?.length || 0,
      icon: <Users className="size-5 text-purple-600" />,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="bg-white border border-gray-300 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{m.label}</p>
                <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
              </div>
              <div className={`p-2 rounded-md ${m.bg}`}>{m.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h2 className="text-gray-900 mb-4 font-medium">Tasks by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#4b5563", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <YAxis
                tick={{ fill: "#4b5563", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h2 className="text-gray-900 mb-4 font-medium">Tasks by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {typeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h2 className="text-gray-900 mb-4 font-medium">Tasks by Priority</h2>

        <div className="space-y-4">
          {priorityData.map((p) => (
            <div key={p.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ArrowRightIcon className="size-3.5 text-gray-600" />
                  <span className="capitalize">{p.name.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{p.value} tasks</span>
                  <span className="px-2 py-0.5 border border-gray-400 text-gray-600 text-xs rounded">
                    {p.percentage}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-300 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${PRIORITY_COLORS[p.name]}`}
                  style={{ width: `${p.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
