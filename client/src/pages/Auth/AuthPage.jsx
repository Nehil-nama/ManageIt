import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Zap } from "lucide-react";
import toast from "react-hot-toast";

const AuthPage = ({ mode = "login" }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const isLogin = mode === "login";

  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      toast.success(isLogin ? "Welcome back!" : "Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-dark-heading">ManageIt</h1>
          <p className="text-slate-500 dark:text-dark-text text-sm mt-1">
            {isLogin ? "Sign in to your ManageIt workspace" : "Create your ManageIt workspace"}
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-1">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required className="input" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@company.com" required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-1">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required minLength={6} className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-dark-text mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link to={isLogin ? "/register" : "/login"} className="text-primary-600 font-medium hover:underline">
              {isLogin ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
