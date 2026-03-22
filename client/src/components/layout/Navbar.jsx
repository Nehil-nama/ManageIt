import { Sun, Moon, Bell, Search } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ title }) => {
  const { dark, toggle } = useTheme();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/search?q=${query}`); setQuery(""); }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-card/80 backdrop-blur border-b border-slate-200 dark:border-dark-border px-6 py-3 flex items-center justify-between gap-4">
      <h1 className="text-lg font-bold text-slate-900 dark:text-dark-heading hidden sm:block">{title}</h1>

      <form onSubmit={handleSearch} className="flex-1 max-w-sm">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tasks..."
            className="input pl-9 py-1.5 text-sm"
          />
        </div>
      </form>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition text-slate-500 dark:text-dark-text">
          <Bell size={18} />
        </button>
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition text-slate-500 dark:text-dark-text">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
