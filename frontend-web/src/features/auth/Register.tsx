import React, { useState } from "react";
import MmaLogo from "../../components/MmaLogo";
import DarkModeToggle from "../../components/DarkModeToggle";
import Toast from "../../components/Toast";
import { authAPI } from '../../services/api';

interface RegisterProps {
  onSigninClick: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSigninClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    if (formData.password !== formData.confirmPassword) {
      setToast({ message: '❌ Passwords do not match', type: 'error' });
      setLoading(false);
      return;
    }
    try {
      const result = await authAPI.register(formData.username, formData.email, formData.password);
      setToast({ message: `✅ Registration successful! Welcome ${result.email}`, type: 'success' });
    } catch (error: any) {
      setToast({ message: `❌ Registration failed: ${error.response?.data?.detail || 'Unknown error'}`, type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative">
      <DarkModeToggle />
      <div className="w-full max-w-md bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 rounded-2xl shadow-xl p-8 relative">
        <div className="flex flex-col items-center mb-6">
          <MmaLogo className="h-14 w-14 mb-2 text-emerald-600 dark:text-blue-400" />
          <h1 className="text-2xl font-extrabold tracking-tight text-emerald-700 dark:text-blue-400 font-nunito">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">Join MMA to manage your medications</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-blue-400 transition"
              placeholder="Choose a username"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-blue-400 transition"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-blue-400 pr-10 transition"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-emerald-500 dark:hover:text-blue-400 transition"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-blue-400 pr-10 transition"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-emerald-500 dark:hover:text-blue-400 transition"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-emerald-500 dark:bg-blue-500 hover:bg-emerald-600 dark:hover:bg-blue-600 text-white font-semibold transition transform active:scale-95 focus:ring-2 focus:ring-emerald-400 dark:focus:ring-blue-400"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 dark:text-emerald-400 hover:underline font-medium"
              onClick={onSigninClick}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Register;
