import { useParams, useNavigate } from "react-router-dom";
import { Trash2, ArrowLeft, Plus, CheckSquare } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { Badge, PageLoader, Avatar, EmptyState } from "../../components/ui";
import useFetch from "../../hooks/useFetch";
import api from "../../utils/api";
import { formatDate, priorityColor, statusColor } from "../../utils/helpers";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, loading: pl } = useFetch(`/projects/${id}`);
  const { data: tasks,   loading: tl } = useFetch(`/tasks?project=${id}`);

  const handleDelete = async () => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      navigate("/projects");
    } catch { toast.error("Failed to delete project"); }
  };

  if (pl || tl) return <PageWrapper title="Project Detail"><PageLoader /></PageWrapper>;
  if (!project)  return <PageWrapper title="Not Found"><p className="text-slate-400">Project not found.</p></PageWrapper>;

  const tasksByStatus = {
    todo:          tasks?.filter((t) => t.status === "todo")        || [],
    "in-progress": tasks?.filter((t) => t.status === "in-progress") || [],
    "in-review":   tasks?.filter((t) => t.status === "in-review")   || [],
    done:          tasks?.filter((t) => t.status === "done")        || [],
  };

  return (
    <PageWrapper
      title={project.name}
      action={
        <div className="flex gap-2">
          <Link to="/projects" className="btn-secondary"><ArrowLeft size={16} /> Back</Link>
          <button onClick={handleDelete} className="btn-danger"><Trash2 size={16} /> Delete</button>
        </div>
      }
    >
      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Details */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-dark-heading">{project.name}</h2>
            <div className="flex gap-2 flex-shrink-0">
              <Badge label={project.priority} className={priorityColor(project.priority)} />
              <Badge label={project.status}   className={statusColor(project.status)}     />
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-dark-text mb-4">{project.description || "No description provided."}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 text-xs mb-0.5">Start Date</p>
              <p className="font-medium text-slate-700 dark:text-dark-heading">{formatDate(project.startDate)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-0.5">End Date</p>
              <p className="font-medium text-slate-700 dark:text-dark-heading">{formatDate(project.endDate)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-0.5">Owner</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Avatar name={project.owner?.name} size="sm" />
                <p className="font-medium text-slate-700 dark:text-dark-heading">{project.owner?.name}</p>
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-0.5">Team</p>
              <p className="font-medium text-slate-700 dark:text-dark-heading">{project.team?.name || "No team"}</p>
            </div>
          </div>
          {project.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <span key={tag} className="badge bg-slate-100 dark:bg-dark-border text-slate-600 dark:text-dark-text">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Members */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-dark-heading mb-3">Members ({project.members?.length})</h3>
          <div className="space-y-2">
            {project.members?.map((m) => (
              <div key={m._id} className="flex items-center gap-2.5">
                <Avatar name={m.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-dark-heading">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Summary */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 dark:text-dark-heading">
            Tasks <span className="text-slate-400 font-normal text-sm ml-1">({tasks?.length || 0})</span>
          </h3>
          <Link to={`/tasks`} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
            <Plus size={12} /> Add task
          </Link>
        </div>

        {!tasks?.length ? (
          <EmptyState icon={CheckSquare} title="No tasks" description="No tasks added to this project yet." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {Object.entries(tasksByStatus).map(([status, list]) => (
              <div key={status} className="bg-slate-50 dark:bg-dark-bg rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-slate-800 dark:text-dark-heading">{list.length}</p>
                <p className="text-xs text-slate-500 dark:text-dark-text capitalize mt-0.5">{status.replace("-"," ")}</p>
              </div>
            ))}
          </div>
        )}

        {tasks?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-dark-border">
                  {["Task","Assignee","Priority","Status","Due"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-dark-border">
                {tasks.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-dark-border/40 transition">
                    <td className="py-2 px-3 font-medium text-slate-800 dark:text-dark-heading truncate max-w-[160px]">{t.title}</td>
                    <td className="py-2 px-3">
                      {t.assignee
                        ? <div className="flex items-center gap-1.5"><Avatar name={t.assignee.name} size="sm" /><span className="text-slate-600 dark:text-dark-text">{t.assignee.name}</span></div>
                        : <span className="text-slate-400 text-xs">Unassigned</span>}
                    </td>
                    <td className="py-2 px-3"><Badge label={t.priority} className={priorityColor(t.priority)} /></td>
                    <td className="py-2 px-3"><Badge label={t.status}   className={statusColor(t.status)}   /></td>
                    <td className="py-2 px-3 text-slate-500 dark:text-dark-text">{formatDate(t.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ProjectDetailPage;
