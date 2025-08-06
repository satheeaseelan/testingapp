import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Receipt, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExpenses: 0,
    totalAmount: 0,
    monthlyGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      setLoading(true);
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setStats({
        totalUsers: 156,
        totalExpenses: 1247,
        totalAmount: 45678.90,
        monthlyGrowth: 12.5,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: 'Total Expenses',
      value: stats.totalExpenses,
      icon: Receipt,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+8%',
      changeType: 'increase',
    },
    {
      title: 'Total Amount',
      value: `$${stats.totalAmount.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+15%',
      changeType: 'increase',
    },
    {
      title: 'Monthly Growth',
      value: `${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: '+2.5%',
      changeType: 'increase',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user',
      message: 'New user John Doe registered',
      time: '2 minutes ago',
    },
    {
      id: 2,
      type: 'expense',
      message: 'Expense of $250 added by Alice Smith',
      time: '15 minutes ago',
    },
    {
      id: 3,
      type: 'user',
      message: 'User profile updated by Bob Johnson',
      time: '1 hour ago',
    },
    {
      id: 4,
      type: 'expense',
      message: 'Monthly report generated',
      time: '2 hours ago',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your system.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className={`flex items-center text-sm ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'increase' ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </div>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'user' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {activity.type === 'user' ? (
                      <Users className={`h-4 w-4 ${
                        activity.type === 'user' ? 'text-blue-600' : 'text-green-600'
                      }`} />
                    ) : (
                      <Receipt className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <h4 className="font-medium text-gray-900">Add User</h4>
                <p className="text-sm text-gray-500">Create new user account</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Receipt className="h-8 w-8 text-green-600 mb-2" />
                <h4 className="font-medium text-gray-900">Add Expense</h4>
                <p className="text-sm text-gray-500">Record new expense</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
                <h4 className="font-medium text-gray-900">View Reports</h4>
                <p className="text-sm text-gray-500">Generate analytics</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <DollarSign className="h-8 w-8 text-orange-600 mb-2" />
                <h4 className="font-medium text-gray-900">Export Data</h4>
                <p className="text-sm text-gray-500">Download reports</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
