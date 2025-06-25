import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

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
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error: any) {
      setMessage(`❌ Password reset failed: ${error.response?.data?.detail || 'Unknown error'}`);
    }
    setResetLoading(false);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-emerald-100">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          
          {/* Password Reset Form */}
          {resetMode ? (
            <>
              <h2 className="text-2xl font-bold text-center text-orange-600 mb-2">Reset Password</h2>
              <p className="text-center text-gray-500 mb-6">Enter your new password below</p>
              <form className="space-y-5" onSubmit={handlePasswordResetSubmit}>
                <div>
                  <label htmlFor="resetToken" className="block text-sm font-medium text-gray-700 mb-1">Reset Token</label>
                  <input
                    id="resetToken"
                    type="text"
                    value={resetToken}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    placeholder="Reset token from email"
                  />
                  <p className="text-xs text-gray-500 mt-1">This token was provided in your reset email</p>
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Enter your new password"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Confirm your new password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {resetLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>
                <button
                  type="button"
                  className="w-full py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold transition"
                  onClick={() => setResetMode(false)}
                >
                  Back to Login
                </button>
              </form>
            </>
          ) : (
            /* Normal Login Form */
            <>
              <h2 className="text-2xl font-bold text-center text-blue-700 mb-2">Sign in to MMA</h2>
              <p className="text-center text-gray-500 mb-6">Medication Management & Adherence</p>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span />
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline font-medium"
                    onClick={() => setForgotPasswordOpen(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button type="button" className="text-emerald-600 hover:underline font-medium" onClick={onSignupClick}>
                    Sign up
                  </button>
                </div>
              </form>
            </>
          )}
          
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4">Forgot Password</h3>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter your email address
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  onClick={() => setForgotPasswordOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {forgotLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
              {forgotMessage && (
                <div className={`p-3 rounded-lg text-sm ${forgotMessage.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {forgotMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
