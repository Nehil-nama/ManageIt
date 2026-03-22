import { format, formatDistanceToNow, isPast } from "date-fns";

export const formatDate = (date) =>
  date ? format(new Date(date), "MMM dd, yyyy") : "—";

export const timeAgo = (date) =>
  date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : "";

export const isOverdue = (date) => date && isPast(new Date(date));

export const priorityColor = (priority) => ({
  low:    "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  high:   "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  urgent: "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400",
}[priority] || "bg-slate-100 text-slate-600");

export const statusColor = (status) => ({
  todo:        "bg-slate-100  text-slate-600  dark:bg-slate-700  dark:text-slate-300",
  "in-progress":"bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400",
  "in-review":  "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  done:         "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  planning:     "bg-slate-100  text-slate-600",
  active:       "bg-blue-100   text-blue-700",
  "on-hold":    "bg-yellow-100 text-yellow-700",
  completed:    "bg-green-100  text-green-700",
}[status] || "bg-slate-100 text-slate-600");

export const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export const avatarColor = (name = "") => {
  const colors = [
    "bg-blue-500","bg-purple-500","bg-pink-500","bg-indigo-500",
    "bg-teal-500","bg-orange-500","bg-rose-500","bg-cyan-500",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};
