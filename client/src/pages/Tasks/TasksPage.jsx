import { useState } from "react";
import { Plus, CheckSquare } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { Badge, Modal, EmptyState, PageLoader, Avatar } from "../../components/ui";
import useFetch from "../../hooks/useFetch";
import api from "../../utils/api";
import { formatDate, priorityColor, statusColor, isOverdue } from "../../utils/helpers";
import toast from "react-hot-toast";

const COLUMNS = [
  { key: "todo",        label: "To Do",       color: "bg-slate-400" },
  { key: "in-progress", label: "In Progress",  color: "bg-blue-500"  },
  { key: "in-review",   label: "In Review",    color: "bg-purple-500"},
  { key: "done",        label: "Done",         color: "bg-green-500" },
];

const PRIORITIES = ["low","medium","high","urgent"];

const TaskCard = ({ task, onStatusChange }) => (
  <div className="card p-3 cursor-pointer hover:shadow-md transition-all group">
    <div className="flex items-start justify-between mb-2 gap-1">
      <span className={`badge ${priorityColor(task.priority)}`}>{task.priority}</span>
      {isOverdue(task.dueDate) && task.status !== "done" && (
        <span className="badge bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">overdue</span>
      )}
    </div>
    <p className="text-sm font-medium text-slate-800 dark:text-dark-heading mb-1 line-clamp-2">{task.title}</p>
    {task.project && <p className="text-xs text-slate-400 mb-2">{task.project.name}</p>}
    <div className="flex items-center justify-between mt-2">
      {task.assignee
        ? <Avatar name={task.assignee.name} size="sm" />
        : <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-dark-border border-2 border-dashed border-slate-300" />}
      <span className="text-xs text-slate-400">{formatDate(task.dueDate)}</span>
    </div>
    {/* Quick status change */}
    <select
      value={task.status}
      onChange={(e) => onStatusChange(task._id, e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className="mt-2 w-full text-xs input py-1 opacity-0 group-hover:opacity-100 transition"
    >
      {COLUMNS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
    </select>
  </div>
);

const TasksPage = () => {
  const { data: tasks,    loading: tl, refetch } = useFetch("/tasks");
  const { data: projects, loading: pl }          = useFetch("/projects");
  const { data: users,    loading: ul }          = useFetch("/users");

  const [modal,  setModal]  = useState(false);
  const [saving, setSaving] = useState(false);
  const [view,   setView]   = useState("kanban"); // kanban | list
  const [form,   setForm]   = useState({
    title: "", description: "", status: "todo", priority: "medium",
    project: "", assignee: "", dueDate: ""
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.project) return toast.error("Please select a project");
    setSaving(true);
    try {
      await api.post("/tasks", form);
      toast.success("Task created!");
      setModal(false);
      setForm({ title:"", description:"", status:"todo", priority:"medium", project:"", assignee:"", dueDate:"" });
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating task");
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      refetch();
      toast.success("Status updated");
    } catch { toast.error("Failed to update status"); }
  };

  const loading = tl || pl || ul;

  return (
    <PageWrapper
      title="Tasks"
      action={
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 dark:border-dark-border overflow-hidden">
            {["kanban","list"].map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition ${view === v ? "bg-primary-600 text-white" : "text-slate-600 dark:text-dark-text hover:bg-slate-50 dark:hover:bg-dark-border"}`}>
                {v}
              </button>
            ))}
          </div>
          <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> New Task</button>
        </div>
      }
    >
      {loading ? <PageLoader /> : (
        <>
          {(!tasks || tasks.length === 0) ? (
            <EmptyState
              icon={CheckSquare} title="No tasks yet" description="Create your first task to start tracking work"
              action={<button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> New Task</button>}
            />
          ) : view === "kanban" ? (
            /* ── Kanban Board ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
              {COLUMNS.map((col) => {
                const colTasks = tasks.filter((t) => t.status === col.key);
                return (
                  <div key={col.key} className="bg-slate-100 dark:bg-dark-card/50 rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                      <span className="text-sm font-semibold text-slate-700 dark:text-dark-heading">{col.label}</span>
                      <span className="ml-auto text-xs bg-slate-200 dark:bg-dark-border text-slate-600 dark:text-dark-text rounded-full px-2 py-0.5">{colTasks.length}</span>
                    </div>
                    <div className="space-y-2">
                      {colTasks.map((t) => <TaskCard key={t._id} task={t} onStatusChange={handleStatusChange} />)}
                      {colTasks.length === 0 && (
                        <div className="text-center py-6 text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-dark-border rounded-xl">Empty</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── List View ── */
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-dark-border">
                  <tr>
                    {["Task","Project","Assignee","Priority","Status","Due Date"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-dark-text uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                  {tasks.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-dark-border/50 transition">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-dark-heading max-w-xs truncate">{t.title}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-dark-text">{t.project?.name || "—"}</td>
                      <td className="px-4 py-3">
                        {t.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={t.assignee.name} size="sm" />
                            <span className="text-slate-700 dark:text-dark-text">{t.assignee.name}</span>
                          </div>
                        ) : <span className="text-slate-400">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3"><Badge label={t.priority} className={priorityColor(t.priority)} /></td>
                      <td className="px-4 py-3"><Badge label={t.status}   className={statusColor(t.status)}   /></td>
                      <td className={`px-4 py-3 text-sm ${isOverdue(t.dueDate) && t.status !== "done" ? "text-red-500 font-medium" : "text-slate-500 dark:text-dark-text"}`}>
                        {formatDate(t.dueDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Create Task Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Create New Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="Task title" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="What needs to be done?" className="input resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Project *</label>
              <select name="project" value={form.project} onChange={handleChange} className="input">
                <option value="">Select project</option>
                {projects?.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Assignee</label>
              <select name="assignee" value={form.assignee} onChange={handleChange} className="input">
                <option value="">Unassigned</option>
                {users?.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="input">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="input" />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Creating..." : "Create Task"}</button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default TasksPage;
