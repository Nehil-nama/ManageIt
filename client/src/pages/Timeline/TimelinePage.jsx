import PageWrapper from "../../components/layout/PageWrapper";
import { PageLoader, Badge } from "../../components/ui";
import useFetch from "../../hooks/useFetch";
import { formatDate, statusColor, priorityColor } from "../../utils/helpers";
import { CalendarDays } from "lucide-react";
import { differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, format, isToday, parseISO } from "date-fns";

const TimelinePage = () => {
  const { data: projects, loading } = useFetch("/projects");

  const today     = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd   = endOfMonth(today);
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const validProjects = (projects || []).filter((p) => p.startDate && p.endDate);

  const getBar = (project) => {
    const start = parseISO(project.startDate);
    const end   = parseISO(project.endDate);
    const totalDays = days.length;
    const startIdx  = Math.max(0, differenceInDays(start, monthStart));
    const endIdx    = Math.min(totalDays - 1, differenceInDays(end, monthStart));
    if (endIdx < 0 || startIdx >= totalDays) return null;
    const left  = (startIdx / totalDays) * 100;
    const width = ((endIdx - startIdx + 1) / totalDays) * 100;
    return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
  };

  const barColor = {
    planning:  "bg-slate-400",
    active:    "bg-blue-500",
    "on-hold": "bg-yellow-400",
    completed: "bg-green-500",
  };

  return (
    <PageWrapper title="Timeline">
      {loading ? <PageLoader /> : (
        <div className="card overflow-hidden">
          {/* Month header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-dark-border flex items-center gap-2">
            <CalendarDays size={18} className="text-primary-600" />
            <h2 className="font-bold text-slate-900 dark:text-dark-heading">{format(today, "MMMM yyyy")}</h2>
          </div>

          <div className="overflow-x-auto">
            <div style={{ minWidth: "900px" }}>
              {/* Day headers */}
              <div className="flex border-b border-slate-200 dark:border-dark-border">
                <div className="w-56 flex-shrink-0 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-dark-text uppercase tracking-wide">Project</div>
                <div className="flex-1 flex">
                  {days.map((d) => (
                    <div
                      key={d.toISOString()}
                      className={`flex-1 py-2 text-center text-xs font-medium border-l border-slate-100 dark:border-dark-border
                        ${isToday(d) ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-bold" : "text-slate-400"}`}
                    >
                      {format(d, "d")}
                    </div>
                  ))}
                </div>
              </div>

              {/* Project rows */}
              {validProjects.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-slate-400 text-sm">No projects with start & end dates this month.</p>
                  <p className="text-slate-400 text-xs mt-1">Add dates to your projects to see them here.</p>
                </div>
              ) : (
                validProjects.map((p) => {
                  const bar = getBar(p);
                  return (
                    <div key={p._id} className="flex border-b border-slate-100 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-border/30 transition">
                      {/* Project label */}
                      <div className="w-56 flex-shrink-0 px-4 py-3 flex flex-col justify-center">
                        <p className="text-sm font-semibold text-slate-800 dark:text-dark-heading truncate">{p.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          <Badge label={p.status}   className={`${statusColor(p.status)} text-xs`}   />
                          <Badge label={p.priority} className={`${priorityColor(p.priority)} text-xs`} />
                        </div>
                      </div>
                      {/* Gantt bar area */}
                      <div className="flex-1 relative py-3">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex">
                          {days.map((d) => (
                            <div key={d.toISOString()}
                              className={`flex-1 border-l ${isToday(d) ? "border-primary-300 dark:border-primary-700 bg-primary-50/40 dark:bg-primary-900/10" : "border-slate-100 dark:border-dark-border"}`}
                            />
                          ))}
                        </div>
                        {/* Bar */}
                        {bar && (
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 h-6 rounded-full ${barColor[p.status] || "bg-slate-400"} opacity-90 flex items-center px-2 z-10`}
                            style={{ left: bar.left, width: bar.width }}
                            title={`${p.name}: ${formatDate(p.startDate)} → ${formatDate(p.endDate)}`}
                          >
                            <span className="text-white text-xs font-medium truncate">{p.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 px-6 py-3 border-t border-slate-100 dark:border-dark-border flex-wrap">
            {Object.entries(barColor).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-xs text-slate-500 dark:text-dark-text capitalize">{status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default TimelinePage;
