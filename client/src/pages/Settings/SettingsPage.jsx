import { useState } from "react";
import { Sun, Moon, User, Lock, Bell } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Avatar } from "../../components/ui";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Section = ({ title, icon: Icon, children }) => (
  <div className="card p-6 mb-4">
    <h3 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-dark-heading mb-4 pb-3 border-b border-slate-100 dark:border-dark-border">
      <Icon size={16} className="text-primary-600" /> {title}
    </h3>
    {children}
  </div>
);

const SettingsPage = () => {
  const { user }       = useAuth();
  const { dark, toggle } = useTheme();

  const [profile, setProfile]   = useState({ name: user?.name || "", email: user?.email || "" });
  const [password, setPassword] = useState({ current: "", newPwd: "", confirm: "" });
  const [saving, setSaving]     = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/users/${user._id}`, { name: profile.name });
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (password.newPwd !== password.confirm) return toast.error("Passwords don't match");
    if (password.newPwd.length < 6) return toast.error("Password must be at least 6 characters");
    toast.success("Password change coming soon!");
    setPassword({ current: "", newPwd: "", confirm: "" });
  };

  return (
    <PageWrapper title="Settings">
      <div className="max-w-2xl">

        {/* Profile */}
        <Section title="Profile" icon={User}>
          <div className="flex items-center gap-4 mb-5">
            <Avatar name={user?.name} size="lg" />
            <div>
              <p className="font-semibold text-slate-800 dark:text-dark-heading">{user?.name}</p>
              <p className="text-sm text-slate-500 dark:text-dark-text">{user?.email}</p>
              <span className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-2 py-0.5 rounded-full capitalize mt-1 inline-block">{user?.role}</span>
            </div>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Full Name</label>
              <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Email</label>
              <input value={profile.email} disabled className="input opacity-60 cursor-not-allowed" />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
            </div>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Changes"}</button>
          </form>
        </Section>

        {/* Appearance */}
        <Section title="Appearance" icon={dark ? Moon : Sun}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-dark-heading">Dark Mode</p>
              <p className="text-xs text-slate-500 dark:text-dark-text mt-0.5">Switch between light and dark theme</p>
            </div>
            <button
              onClick={toggle}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${dark ? "bg-primary-600" : "bg-slate-300"}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${dark ? "translate-x-6" : ""}`} />
            </button>
          </div>
        </Section>

        {/* Password */}
        <Section title="Password" icon={Lock}>
          <form onSubmit={handlePasswordSave} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Current Password</label>
              <input type="password" value={password.current} onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">New Password</label>
              <input type="password" value={password.newPwd} onChange={(e) => setPassword((p) => ({ ...p, newPwd: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-dark-text">Confirm New Password</label>
              <input type="password" value={password.confirm} onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))} className="input" />
            </div>
            <button type="submit" className="btn-primary">Update Password</button>
          </form>
        </Section>

        {/* Notifications placeholder */}
        <Section title="Notifications" icon={Bell}>
          <div className="space-y-3">
            {["Email notifications","Task assignments","Project updates","Due date reminders"].map((label) => (
              <div key={label} className="flex items-center justify-between">
                <p className="text-sm text-slate-700 dark:text-dark-text">{label}</p>
                <input type="checkbox" defaultChecked className="rounded text-primary-600 cursor-pointer" />
              </div>
            ))}
          </div>
        </Section>

      </div>
    </PageWrapper>
  );
};

export default SettingsPage;
