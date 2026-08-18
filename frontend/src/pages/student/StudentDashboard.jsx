import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import attemptService from '../../services/attemptService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const StudentDashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Reusing the Day 9 service call to fetch all historical data
        const data = await attemptService.getAttemptHistory();
        setHistory(data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center mt-20 text-xl font-semibold">Loading your dashboard...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;


  // 1. Statistics Overview & Score Tracking
  const totalAttempted = history.length;
  const passedAttempts = history.filter(attempt => attempt.status === 'PASSED').length;
  const failedAttempts = history.filter(attempt => attempt.status === 'FAILED').length;
  
  // Calculate average and highest scores
  const highestScore = history.length > 0 
    ? Math.max(...history.map(a => parseFloat(a.percentage))) 
    : 0;
    
  const averageScore = history.length > 0
    ? (history.reduce((acc, curr) => acc + parseFloat(curr.percentage), 0) / history.length).toFixed(1)
    : 0;

  // Calculate total questions answered
  const totalQuestionsAnswered = history.reduce((acc, curr) => {
    return acc + curr.correct_answers + curr.incorrect_answers + curr.unanswered;
  }, 0);

  // 2. Format Data for Recharts
  // We'll reverse the history so the chart reads chronologically (oldest to newest left-to-right)
  const chartData = [...history].reverse().map((attempt, index) => ({
    name: `Quiz ${index + 1}`,
    score: parseFloat(attempt.percentage),
    title: attempt.quizzes?.title || 'Unknown Quiz'
  }));

  // 3. Quiz History (Recent Attempts)
  // Grab just the top 5 most recent attempts
  const recentAttempts = history.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Dashboard</h1>
      {/* Overview Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-gray-500 text-sm">Total Quizzes</div>
          <div className="text-2xl font-bold text-blue-600">{totalAttempted}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-gray-500 text-sm">Average Score</div>
          <div className="text-2xl font-bold text-indigo-600">{averageScore}%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-gray-500 text-sm">Highest Score</div>
          <div className="text-2xl font-bold text-purple-600">{highestScore}%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-gray-500 text-sm">Passed</div>
          <div className="text-2xl font-bold text-green-600">{passedAttempts}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-gray-500 text-sm">Failed</div>
          <div className="text-2xl font-bold text-red-600">{failedAttempts}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-gray-500 text-sm">Questions Answered</div>
          <div className="text-2xl font-bold text-gray-800">{totalQuestionsAnswered}</div>
        </div>
      </div>

      {/* Performance Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Performance Trend</h2>
        {history.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Score']}
                  labelFormatter={(label, payload) => payload[0]?.payload.title || label}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">Complete a quiz to see your performance trend!</div>
        )}
      </div>

      {/* Recent Activity List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          <button 
            onClick={() => navigate('/student/history')} 
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
          >
            View Full History →
          </button>
        </div>
        
        {recentAttempts.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentAttempts.map(attempt => (
              <div key={attempt.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-semibold text-gray-800">{attempt.quizzes?.title || 'Unknown Quiz'}</h3>
                  <p className="text-sm text-gray-500">{new Date(attempt.completed_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{attempt.percentage}%</div>
                    <div className={`text-xs font-bold ${attempt.status === 'PASSED' ? 'text-green-600' : 'text-red-600'}`}>
                      {attempt.status}
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/student/results/${attempt.id}`)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {/* SVG Icon for "Chevron Right" */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">
            <p className="mb-4">No recent activity found.</p>
            <button 
              onClick={() => navigate('/student/quizzes')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Take a Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;