import Navbar from "./Navbar";

const PageWrapper = ({ title, children, action }) => (
  <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
    <Navbar title={title} />
    <main className="flex-1 p-6 overflow-y-auto">
      {action && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-heading">{title}</h2>
          </div>
          <div>{action}</div>
        </div>
      )}
      <div className="animate-fade-in">{children}</div>
    </main>
  </div>
);

export default PageWrapper;
