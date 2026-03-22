import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FolderKanban, Calendar } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { Badge, Modal, EmptyState, PageLoader, Avatar } from "../../components/ui";
import useFetch from "../../hooks/useFetch";
import api from "../../utils/api";
import { formatDate, priorityColor, statusColor } from "../../utils/helpers";
import toast from "react-hot-toast";

const STATUSES   = ["planning","active","on-hold","completed"];
const PRIORITIES = ["low","medium","high","urgent"];

const ProjectCard = ({ project }) => (
  <Link to={`/projects/${project._id}`}
    className="card p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 block">
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
        <FolderKanban size={20} className="text-primary-600" />
      </div>
      <div className="flex gap-1.5">
        <Badge label={project.priority} className={priorityColor(project.priority)} />
        <Badge label={project.status}   className={statusColor(project.status)}     />
      </div>
    </div>
    <h3 className="font-semibold text-slate-900 dark:text-dark-heading mb-1 truncate">{project.name}</h3>
    <p className="text-xs text-slate-500 dark:text-dark-text line-clamp-2 mb-4">{project.description || "No description"}</p>
    <div className="flex items-center justify-between">
      <div className="flex -space-x-2">
        {project.members?.slice(0, 3).map((m) => (
          <div key={m._id} className="ring-2 ring-white dark:ring-dark-card rounded-full">
            <Avatar name={m.name} size="sm" />
          </div>
        ))}
        {project.members?.length > 3 && (
          <div className="w-7 h-7 bg-slate-200 dark:bg-dark-border rounded-full ring-2 ring-white dark:ring-dark-card flex items-center justify-center text-xs text-slate-600 dark:text-dark-text">
            +{project.members.length - 3}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <Calendar size={12} />
        {formatDate(project.endDate)}
      </div>
    </div>
  </Link>
);

const ProjectsPage = () => {
  const { data: projects, loading, refetch } = useFetch("/projects");
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", status: "planning", priority: "medium", startDate: "", endDate: "" });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/projects", form);
      toast.success("Project created!");
      setModal(false);
      setForm({ name: "", description: "", status: "planning", priority: "medium", startDate: "", endDate: "" });
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrapper
      title="Projects"
      action={
        <button onClick={() => setModal(true)} className="btn-primary">
          <Plus size={16} /> New Project
        </button>
      }
    >
      {loading ? <PageLoader /> : (
        <>
          {(!projects || projects.length === 0) ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first project to get started"
              action={<button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> New Project</button>}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
            </div>
          )}
        </>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Create New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Project Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="My Awesome Project" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="What's this project about?" className="input resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="input">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="input" />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Creating..." : "Create Project"}</button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default ProjectsPage;
