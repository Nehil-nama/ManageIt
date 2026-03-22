import { FolderKanban, CheckSquare, Users, AlertCircle } from "lucide-react";
import { StatCard, PageLoader, Avatar, Badge } from "../../components/ui";
import PageWrapper from "../../components/layout/PageWrapper";
import useFetch from "../../hooks/useFetch";
import { formatDate, statusColor } from "../../utils/helpers";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#3b82f6","#10b981","#f59e0b","#ef4444"];

const Dashboard = () => {
  const { data: projects, loading: pl } = useFetch("/projects");
  const { data: tasks,    loading: tl } = useFetch("/tasks");
  const { data: teams,    loading: el } = useFetch("/teams");

  if (pl || tl || el) return <PageWrapper title="Dashboard"><PageLoader /></PageWrapper>;

  const statusCounts = ["todo","in-progress","in-review","done"].map((s) => ({
    name: s.replace("-", " "),
    value: tasks?.filter((t) => t.status === s).length || 0,
  }));

  const priorityCounts = ["low","medium","high","urgent"].map((p) => ({
    name: p,
    count: tasks?.filter((t) => t.priority === p).length || 0,
  }));

  const recentTasks    = (tasks    || []).slice(0, 5);
  const recentProjects = (projects || []).slice(0, 4);

  return (
    <PageWrapper title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Projects" value={projects?.length || 0}  icon={FolderKanban} color="primary" />
        <StatCard label="Total Tasks"    value={tasks?.length    || 0}  icon={CheckSquare}  color="green"   />
        <StatCard label="Teams"          value={teams?.length    || 0}  icon={Users}        color="purple"  />
        <StatCard label="Overdue Tasks"
          value={tasks?.filter((t) => t.status !== "done" && t.dueDate && new Date(t.dueDate) < new Date()).length || 0}
          icon={AlertCircle} color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-dark-heading mb-4">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityCounts} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-dark-heading mb-4">Task Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {statusCounts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tasks + Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-dark-heading">Recent Tasks</h3>
            <Link to="/tasks" className="text-xs text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentTasks.length === 0 && <p className="text-sm text-slate-400">No tasks yet.</p>}
            {recentTasks.map((t) => (
              <div key={t._id} className="flex items-start gap-3 py-2 border-b border-slate-100 dark:border-dark-border last:border-0">
                <Avatar name={t.assignee?.name || "?"} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-dark-heading truncate">{t.title}</p>
                  <p className="text-xs text-slate-400">{t.project?.name} · Due {formatDate(t.dueDate)}</p>
                </div>
                <Badge label={t.status} className={statusColor(t.status)} />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-dark-heading">Recent Projects</h3>
            <Link to="/projects" className="text-xs text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentProjects.length === 0 && <p className="text-sm text-slate-400">No projects yet.</p>}
            {recentProjects.map((p) => (
              <Link to={`/projects/${p._id}`} key={p._id}
                className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-dark-border last:border-0 hover:bg-slate-50 dark:hover:bg-dark-border rounded-lg px-1 transition">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <FolderKanban size={16} className="text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-dark-heading truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.members?.length || 0} members</p>
                </div>
                <Badge label={p.status} className={statusColor(p.status)} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
