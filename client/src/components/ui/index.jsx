// Badge
export const Badge = ({ label, className = "" }) => (
  <span className={`badge ${className}`}>{label}</span>
);

// Avatar
import { getInitials, avatarColor } from "../../utils/helpers";
export const Avatar = ({ name = "", size = "sm" }) => {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };
  return (
    <div className={`${sizes[size]} ${avatarColor(name)} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {getInitials(name)}
    </div>
  );
};

// Spinner
export const Spinner = ({ size = "md" }) => {
  const s = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" }[size];
  return (
    <div className={`${s} border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
  );
};

// Full-page loader
export const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
);

// Empty state
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && <div className="w-14 h-14 bg-slate-100 dark:bg-dark-border rounded-2xl flex items-center justify-center mb-4"><Icon size={28} className="text-slate-400" /></div>}
    <h3 className="text-base font-semibold text-slate-700 dark:text-dark-heading mb-1">{title}</h3>
    {description && <p className="text-sm text-slate-500 dark:text-dark-text mb-4 max-w-xs">{description}</p>}
    {action}
  </div>
);

// Modal
export const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg card p-6 animate-bounce-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-dark-heading">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition text-xl font-bold leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Stat card
export const StatCard = ({ label, value, icon: Icon, color = "primary", trend }) => {
  const colors = {
    primary: "bg-primary-50 dark:bg-primary-900/20 text-primary-600",
    green:   "bg-green-50   dark:bg-green-900/20   text-green-600",
    orange:  "bg-orange-50  dark:bg-orange-900/20  text-orange-600",
    purple:  "bg-purple-50  dark:bg-purple-900/20  text-purple-600",
  };
  return (
    <div className="card p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-dark-text mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-dark-heading">{value}</p>
        {trend && <p className="text-xs text-slate-400 dark:text-dark-text mt-1">{trend}</p>}
      </div>
      {Icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  );
};
