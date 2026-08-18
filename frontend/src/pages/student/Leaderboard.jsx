import React, { useState, useEffect } from 'react';
import leaderboardService from '../../services/leaderboardService';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the category filter
  const [selectedCategory, setSelectedCategory] = useState('');

  // Static list of categories for the filter (in a real app, you might fetch these from your categoryService)
  const categories = ['JavaScript', 'React', 'Python', 'Node.js', 'HTML', 'CSS'];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await leaderboardService.getLeaderboard(selectedCategory);
        setLeaderboard(data);
      } catch (err) {
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedCategory]); // Re-run the fetch whenever the selected category changes

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {selectedCategory ? `${selectedCategory} Leaderboard` : 'Global Leaderboard'}
        </h1>
        
        {/* Category Filter Dropdown */}
        <div className="mt-4 md:mt-0">
          <select
            className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories (Global)</option>
            {categories.map((cat) => (
               <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-20 text-xl font-semibold text-gray-600">Loading rankings...</div>
      ) : error ? (
        <div className="text-center mt-20 text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center mt-20 text-gray-500 bg-gray-50 p-10 rounded-lg border border-gray-200">
          No ranking data available for this category yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Highest Score</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Average Score</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Quizzes Completed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry) => (
                  <tr 
                    key={entry.rank} 
                    className={`transition-colors ${
                      entry.rank === 1 ? 'bg-yellow-50' : 
                      entry.rank === 2 ? 'bg-gray-50' : 
                      entry.rank === 3 ? 'bg-orange-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`font-bold text-lg ${
                          entry.rank === 1 ? 'text-yellow-600' : 
                          entry.rank === 2 ? 'text-gray-500' : 
                          entry.rank === 3 ? 'text-orange-600' : 'text-gray-700'
                        }`}>
                          #{entry.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {entry.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-green-600">
                      {entry.highestScore}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">
                      {entry.averageScore}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">
                      {entry.quizzesCompleted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;