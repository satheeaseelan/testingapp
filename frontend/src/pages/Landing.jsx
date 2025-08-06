import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Users, 
  Receipt, 
  BarChart3, 
  Shield, 
  Zap, 
  Globe 
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Complete CRUD operations with role-based access control and user analytics.',
    },
    {
      icon: Receipt,
      title: 'Expense Tracking',
      description: 'Categorized expense management with payment methods and receipt storage.',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Interactive dashboard with statistics, charts, and business insights.',
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'JWT-based authentication with password encryption and session management.',
    },
    {
      icon: Zap,
      title: 'Modern UI/UX',
      description: 'Responsive design with smooth animations and intuitive user interface.',
    },
    {
      icon: Globe,
      title: 'RESTful APIs',
      description: 'Complete REST API with proper HTTP status codes and error handling.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MS</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Management System
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Modern{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                Management
              </span>{' '}
              System
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive Spring Boot application with React frontend featuring user management, 
              expense tracking, and real-time analytics with modern UI/UX design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Try Demo Accounts
            </h2>
            <p className="text-lg text-gray-600">
              Use these credentials to explore the system features
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Admin Account</h3>
              <div className="space-y-2">
                <p className="text-sm text-primary-700">
                  <span className="font-medium">Username:</span> admin
                </p>
                <p className="text-sm text-primary-700">
                  <span className="font-medium">Password:</span> admin123
                </p>
                <p className="text-xs text-primary-600 mt-3">
                  Full system access with user management capabilities
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 p-6 rounded-lg border border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">User Account</h3>
              <div className="space-y-2">
                <p className="text-sm text-secondary-700">
                  <span className="font-medium">Username:</span> user
                </p>
                <p className="text-sm text-secondary-700">
                  <span className="font-medium">Password:</span> user123
                </p>
                <p className="text-xs text-secondary-600 mt-3">
                  Standard user access with expense management features
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with modern technologies and best practices for scalability and performance
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500">
              © 2024 Management System. Built with Spring Boot & React.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
