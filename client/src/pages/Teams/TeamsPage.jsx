import { useState } from "react";
import { Plus, Users, Briefcase } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { Modal, EmptyState, PageLoader, Avatar } from "../../components/ui";
import useFetch from "../../hooks/useFetch";
import api from "../../utils/api";
import { statusColor } from "../../utils/helpers";
import toast from "react-hot-toast";

const TeamCard = ({ team }) => (
  <div className="card p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-11 h-11 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
        <Users size={20} className="text-purple-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 dark:text-dark-heading truncate">{team.name}</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Lead: {team.lead?.name || "Unassigned"}
        </p>
      </div>
    </div>

    {team.description && (
      <p className="text-xs text-slate-500 dark:text-dark-text line-clamp-2 mb-4">{team.description}</p>
    )}

    {/* Members */}
    <div className="mb-4">
      <p className="text-xs font-medium text-slate-500 dark:text-dark-text mb-2">Members ({team.members?.length || 0})</p>
      <div className="flex -space-x-2">
        {team.members?.slice(0, 5).map((m) => (
          <div key={m._id} title={m.name} className="ring-2 ring-white dark:ring-dark-card rounded-full">
            <Avatar name={m.name} size="sm" />
          </div>
        ))}
        {team.members?.length > 5 && (
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-dark-border ring-2 ring-white dark:ring-dark-card flex items-center justify-center text-xs text-slate-600">
            +{team.members.length - 5}
          </div>
        )}
      </div>
    </div>

    {/* Projects */}
    {team.projects?.length > 0 && (
      <div className="border-t border-slate-100 dark:border-dark-border pt-3">
        <p className="text-xs font-medium text-slate-500 dark:text-dark-text mb-2 flex items-center gap-1">
          <Briefcase size={11} /> {team.projects.length} Project{team.projects.length !== 1 ? "s" : ""}
        </p>
        <div className="flex flex-wrap gap-1">
          {team.projects.slice(0, 3).map((p) => (
            <span key={p._id} className={`badge ${statusColor(p.status)} text-xs`}>{p.name}</span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const TeamsPage = () => {
  const { data: teams, loading, refetch } = useFetch("/teams");
  const { data: users }                   = useFetch("/users");

  const [modal,  setModal]  = useState(false);
  const [saving, setSaving] = useState(false);
  const [form,   setForm]   = useState({ name: "", description: "", members: [] });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const toggleMember = (id) =>
    setForm((f) => ({
      ...f,
      members: f.members.includes(id) ? f.members.filter((m) => m !== id) : [...f.members, id],
    }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/teams", form);
      toast.success("Team created!");
      setModal(false);
      setForm({ name: "", description: "", members: [] });
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating team");
    } finally { setSaving(false); }
  };

  return (
    <PageWrapper
      title="Teams"
      action={
        <button onClick={() => setModal(true)} className="btn-primary">
          <Plus size={16} /> New Team
        </button>
      }
    >
      {loading ? <PageLoader /> : (
        <>
          {(!teams || teams.length === 0) ? (
            <EmptyState
              icon={Users} title="No teams yet" description="Create a team to start collaborating"
              action={<button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> New Team</button>}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((t) => <TeamCard key={t._id} team={t} />)}
            </div>
          )}
        </>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Create New Team">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Team Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Design Squad" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="What does this team work on?" className="input resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-dark-text">Add Members</label>
            <div className="max-h-40 overflow-y-auto space-y-1 border border-slate-200 dark:border-dark-border rounded-lg p-2">
              {users?.map((u) => (
                <label key={u._id} className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-slate-50 dark:hover:bg-dark-border">
                  <input
                    type="checkbox"
                    checked={form.members.includes(u._id)}
                    onChange={() => toggleMember(u._id)}
                    className="rounded text-primary-600"
                  />
                  <Avatar name={u.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-dark-heading">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                </label>
              ))}
              {!users?.length && <p className="text-sm text-slate-400 text-center py-2">No users available</p>}
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Creating..." : "Create Team"}</button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default TeamsPage;
