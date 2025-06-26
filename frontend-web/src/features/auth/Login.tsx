import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import { usePersistentTheme } from '../../hooks/usePersistentTheme';
import DarkModeToggle from '../../components/DarkModeToggle';

interface LoginProps {
  onSignupClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onSignupClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Password reset state
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Persistent dark mode
  const [darkMode, setDarkMode] = usePersistentTheme();

  // Check for reset token in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('reset_token');
    if (token) {
      setResetToken(token);
      setResetMode(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const result = await authAPI.login(email, password);
      setMessage(`✅ Login successful! Welcome ${result.user.email}`);
    } catch (error: any) {
      setMessage(`❌ Login failed: ${error.response?.data?.detail || 'Unknown error'}`);
    }
    setLoading(false);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage('');
    try {
      await authAPI.requestPasswordReset(forgotEmail);
      setForgotMessage('✅ Password reset instructions sent if email exists');
    } catch (error: any) {
      setForgotMessage(`❌ Error: ${error.response?.data?.detail || 'Unknown error'}`);
    }
    setForgotLoading(false);
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }

    setResetLoading(true);
    setMessage('');
    try {
      await authAPI.confirmPasswordReset(resetToken, newPassword);
      setMessage('✅ Password reset successful! You can now login with your new password.');
      setResetMode(false);
      setResetToken('');
      setNewPassword('');
      setConfirmPassword('');
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error: any) {
      setMessage(`❌ Password reset failed: ${error.response?.data?.detail || 'Unknown error'}`);
    }
    setResetLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue/10 via-white to-medical-teal/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center font-inter relative overflow-hidden">
      {/* Background blur elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-medical-blue/20 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-medical-emerald/20 rounded-full filter blur-3xl"></div>

      {/* Dark mode toggle */}
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

      {/* Main card */}
      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-medical-blue/5 to-medical-teal/5 rounded-3xl"></div>
          <div className="relative z-10">
            {/* Logo and branding */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-2xl mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold font-nunito text-medical-blue dark:text-medical-teal mb-2">
                {resetMode ? "Reset Password" : "Welcome to MMA"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Medication Management & Adherence</p>
            </div>

            {/* Form */}
            {resetMode ? (
              <form onSubmit={handlePasswordResetSubmit} className="space-y-6">
                <div>
                  <label htmlFor="resetToken" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Reset Token</label>
                  <input
                    id="resetToken"
                    type="text"
                    value={resetToken}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-600 font-medium"
                    placeholder="Reset token from email"
                  />
                  <p className="text-xs text-gray-500 mt-1">This token was provided in your reset email</p>
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-medical-emerald focus:border-transparent transition-all duration-300 backdrop-blur-sm font-medium placeholder-gray-400"
                    placeholder="Enter your new password"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-medical-emerald focus:border-transparent transition-all duration-300 backdrop-blur-sm font-medium placeholder-gray-400"
                    placeholder="Confirm your new password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-medical-emerald to-medical-teal text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-medical-emerald/25 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {resetLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
                <button
                  type="button"
                  className="w-full py-3 px-4 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all duration-300"
                  onClick={() => setResetMode(false)}
                >
                  Back to Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Email or Username
                  </label>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-medical-blue dark:focus:ring-medical-teal focus:border-transparent transition-all duration-300 backdrop-blur-sm font-medium placeholder-gray-400"
                    placeholder="Enter your email or username"
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
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-medical-blue dark:focus:ring-medical-teal focus:border-transparent transition-all duration-300 backdrop-blur-sm font-medium placeholder-gray-400 pr-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-medical-blue dark:hover:text-medical-teal transition-all duration-300 transform hover:scale-110 active:scale-95"
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
                <div className="flex items-center justify-between">
                  <div></div>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-sm font-medium text-medical-blue dark:text-medical-teal hover:text-medical-blue/80 dark:hover:text-medical-teal/80 transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-medical-blue to-medical-teal text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-medical-blue/25 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-grow-glow"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
                <div className="text-center">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={onSignupClick}
                      className="font-semibold text-medical-emerald dark:text-medical-teal hover:text-medical-emerald/80 dark:hover:text-medical-teal/80 transition-colors duration-200 text-link-underline"
                    >
                      Create Account
                    </button>
                  </span>
                </div>
              </form>
            )}
            {message && (
              <div className={`mt-6 p-4 rounded-xl font-medium text-sm ${message.includes('✅') ? 'bg-medical-emerald/10 text-medical-emerald border border-medical-emerald/20' : 'bg-medical-error/10 text-medical-error border border-medical-error/20'} backdrop-blur-sm`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 w-full max-w-sm mx-4">
            <h3 className="text-2xl font-bold font-nunito text-medical-blue dark:text-medical-teal mb-6">Forgot Password</h3>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="forgotEmail" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Enter your email address
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-medical-blue dark:focus:ring-medical-teal focus:border-transparent transition-all duration-300 backdrop-blur-sm font-medium placeholder-gray-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold transition-all duration-300"
                  onClick={() => setForgotPasswordOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-6 py-3 bg-gradient-to-r from-medical-blue to-medical-teal text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-medical-blue/25 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {forgotLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
              {forgotMessage && (
                <div className={`p-4 rounded-xl font-medium text-sm ${forgotMessage.includes('✅') ? 'bg-medical-emerald/10 text-medical-emerald border border-medical-emerald/20' : 'bg-medical-error/10 text-medical-error border border-medical-error/20'} backdrop-blur-sm`}>
                  {forgotMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
