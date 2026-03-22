import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  CalendarDays, Settings, LogOut, Zap, Menu, X
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getInitials, avatarColor } from "../../utils/helpers";

const NAV = [
  { to: "/",         icon: LayoutDashboard, label: "Dashboard"  },
  { to: "/projects", icon: FolderKanban,    label: "Projects"   },
  { to: "/tasks",    icon: CheckSquare,     label: "Tasks"      },
  { to: "/teams",    icon: Users,           label: "Teams"      },
  { to: "/timeline", icon: CalendarDays,    label: "Timeline"   },
  { to: "/settings", icon: Settings,        label: "Settings"   },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-slate-200 dark:border-dark-border">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-bold text-lg text-slate-900 dark:text-dark-heading">ManageIt</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => setOpen(false)}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-dark-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${avatarColor(user?.name)}`}>
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-slate-900 dark:text-dark-heading">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-dark-text capitalize">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-60 h-screen sticky top-0 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border">
        <Content />
      </aside>

      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-dark-card rounded-lg shadow border border-slate-200 dark:border-dark-border"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-60 h-full bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border">
            <Content />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Sidebar;
