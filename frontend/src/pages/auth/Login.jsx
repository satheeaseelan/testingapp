import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setFormData({ username: 'admin', password: 'admin123' });
    } else {
      setFormData({ username: 'user', password: 'user123' });
    }
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Back to home */}
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>

          <div>
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">MS</span>
              </div>
              <h2 className="ml-3 text-3xl font-bold text-gray-900">
                Sign in
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Welcome back! Please sign in to your account.
            </p>
          </div>

          <div className="mt-8">
            {/* Demo Credentials */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 mb-3 font-medium">Demo Accounts:</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Admin (admin/admin123)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('user')}
                  className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  User (user/user123)
                </button>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign in
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Sign up
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Image/Illustration */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h3 className="text-3xl font-bold mb-4">Welcome Back!</h3>
            <p className="text-primary-100 text-lg mb-8">
              Access your management dashboard and continue where you left off.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="font-semibold mb-1">User Management</div>
                <div className="text-primary-200">Complete CRUD operations</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="font-semibold mb-1">Expense Tracking</div>
                <div className="text-primary-200">Categorized management</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="font-semibold mb-1">Real-time Analytics</div>
                <div className="text-primary-200">Interactive dashboard</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="font-semibold mb-1">Secure Authentication</div>
                <div className="text-primary-200">JWT-based security</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
