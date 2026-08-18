import axios from '../api/axios.js';

const leaderboardService = {
  /**
   * Fetches the leaderboard data.
   * @param {string} category - (Optional) The category name to filter by.
   */
  getLeaderboard: async (category = '') => {
    try {
      // Append the category query parameter if one is provided
      const url = category ? `/leaderboard?category=${encodeURIComponent(category)}` : '/leaderboard';
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }
};

export default leaderboardService;