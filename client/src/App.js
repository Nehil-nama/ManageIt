import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider }         from "./context/ThemeContext";

import Sidebar             from "./components/layout/Sidebar";
import { Spinner }         from "./components/ui";

import AuthPage            from "./pages/Auth/AuthPage";
import Dashboard           from "./pages/Dashboard/Dashboard";
import ProjectsPage        from "./pages/Projects/ProjectsPage";
import ProjectDetailPage   from "./pages/Projects/ProjectDetailPage";
import TasksPage           from "./pages/Tasks/TasksPage";
import TeamsPage           from "./pages/Teams/TeamsPage";
import TimelinePage        from "./pages/Timeline/TimelinePage";
import SettingsPage        from "./pages/Settings/SettingsPage";

// Protected layout wrapper
const AppLayout = () => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
      <Spinner size="lg" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-dark-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

// Guest-only redirect
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route path="/login"    element={<GuestRoute><AuthPage mode="login"    /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><AuthPage mode="register" /></GuestRoute>} />

            {/* Protected routes */}
            <Route element={<AppLayout />}>
              <Route index             element={<Dashboard />}          />
              <Route path="projects"   element={<ProjectsPage />}       />
              <Route path="projects/:id" element={<ProjectDetailPage />} />
              <Route path="tasks"      element={<TasksPage />}          />
              <Route path="teams"      element={<TeamsPage />}          />
              <Route path="timeline"   element={<TimelinePage />}       />
              <Route path="settings"   element={<SettingsPage />}       />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            className: "!bg-white dark:!bg-dark-card !text-slate-800 dark:!text-dark-heading !shadow-lg !rounded-xl !border !border-slate-200 dark:!border-dark-border",
            duration: 3000,
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
