import React, { useState } from 'react';
import { usePersistentTheme } from '../../hooks/usePersistentTheme';
import { authAPI } from '../../services/api';
import MmaLogo from '../../components/MmaLogo';
import DarkModeToggle from '../../components/DarkModeToggle';

interface RegisterProps {
  onSigninClick: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSigninClick }) => {
  const [darkMode, setDarkMode] = usePersistentTheme(); // Using persistent theme
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const result = await authAPI.register(formData.username, formData.email, formData.password);
      setMessage(`✅ Registration successful! Welcome ${result.email}`);
    } catch (error: any) {
      setMessage(`❌ Registration failed: ${error.response?.data?.detail || 'Unknown error'}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue/10 via-white to-medical-teal/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center font-inter relative overflow-hidden">
      {/* Background blur elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-medical-blue/20 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-medical-emerald/20 rounded-full filter blur-3xl"></div>
      {/* Dark mode toggle (vertical line, circular) */}
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      {/* Main card with glassmorphism */}
      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 relative overflow-hidden">
          
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Logo and branding */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-2xl mb-6 shadow-lg">
                <MmaLogo className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold font-nunito text-medical-emerald dark:text-medical-teal mb-2">Create Account</h1>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Join MMA to manage your medications</p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-medical-emerald dark:focus:ring-medical-teal focus:border-transparent transition-all duration-300 backdrop-blur-sm font-medium placeholder-gray-400"
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-medical-emerald dark:focus:ring-medical-teal focus:border-transparent transition-all duration-300 backdrop-blur-sm font-medium placeholder-gray-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-medical-emerald dark:focus:ring-medical-teal focus:border-transparent transition-all duration-300 backdrop-blur-sm font-medium placeholder-gray-400 pr-12"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-medical-emerald dark:hover:text-medical-teal transition-all duration-300 transform hover:scale-110 active:scale-95"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg
                      className={`w-5 h-5 transition-all duration-300 ${showPassword ? 'rotate-12 scale-110' : 'rotate-0 scale-100'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={showPassword
                          ? "M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.675-6.825M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        }
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-medical-emerald dark:focus:ring-medical-teal focus:border-transparent transition-all duration-300 backdrop-blur-sm font-medium placeholder-gray-400 pr-12"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-medical-emerald dark:hover:text-medical-teal transition-all duration-300 transform hover:scale-110 active:scale-95"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    <svg
                      className={`w-5 h-5 transition-all duration-300 ${showConfirm ? 'rotate-12 scale-110' : 'rotate-0 scale-100'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={showConfirm
                          ? "M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.675-6.825M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        }
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-medical-emerald to-medical-teal text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-medical-emerald/25 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-grow-glow"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onSigninClick}
                    className="font-semibold text-medical-blue dark:text-medical-teal hover:text-medical-blue/80 dark:hover:text-medical-teal/80 transition-colors duration-200 text-link-underline"
                  >
                    Sign In
                  </button>
                </span>
              </div>
            </form>

            {/* Message display */}
            {message && (
              <div className={`mt-6 p-4 rounded-xl font-medium text-sm ${message.includes('✅') ? 'bg-medical-emerald/10 text-medical-emerald border border-medical-emerald/20' : 'bg-medical-error/10 text-medical-error border border-medical-error/20'} backdrop-blur-sm`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
