import React, { useState } from 'react';
import { authAPI } from '../../services/api';

interface RegisterProps {
  onSigninClick: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSigninClick }) => {
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-emerald-50 via-white to-blue-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-emerald-700 mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">Join MMA to manage your medications</p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Choose a username"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-10"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁️
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button type="button" className="text-blue-600 hover:underline font-medium" onClick={onSigninClick}>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
