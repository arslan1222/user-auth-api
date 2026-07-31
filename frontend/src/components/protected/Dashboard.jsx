import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Calendar, Award, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024', icon: Calendar },
    { label: 'Status', value: user?.isVerified ? 'Verified' : 'Pending', icon: Award },
    { label: 'Role', value: user?.role || 'User', icon: User },
    { label: 'Activity', value: 'Active', icon: Activity },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-8 text-white animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-primary-100">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="bg-primary-100 rounded-full p-3">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Details */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Name</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Member Since</span>
            <span className="font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Last Login</span>
            <span className="font-medium">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;