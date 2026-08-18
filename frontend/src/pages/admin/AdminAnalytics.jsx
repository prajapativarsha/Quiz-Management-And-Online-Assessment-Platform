import React, { useState, useEffect } from 'react';
import {getAnalytics } from '../../services/adminService.js';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAnalytics();
        setStats(data);
      } catch (err) {
        setError('Failed to load platform analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-20 text-xl font-semibold">Loading Analytics...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  // Format data for the Pass/Fail Recharts Pie Chart
  const passFailData = [
    { name: 'Passed', value: stats.passedAttempts },
    { name: 'Failed', value: stats.failedAttempts }
  ];
  const COLORS = ['#10B981', '#EF4444']; // Tailwind Green and Red

  return (
    <div className="max-w-7xl mx-auto p-6 mt-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Platform Analytics</h1>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Total Students</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Total Quizzes</p>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalQuizzes}</p>
          <p className="text-xs text-gray-400 mt-1">{stats.publishedQuizzes} Published</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Total Quiz Attempts</p>
          <p className="text-3xl font-bold text-purple-600">{stats.totalAttempts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Global Average Score</p>
          <p className="text-3xl font-bold text-green-600">{stats.averageScore}%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pass/Fail Ratio Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Pass/Fail Ratio</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passFailData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Attempts`, entry => entry.name]} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;