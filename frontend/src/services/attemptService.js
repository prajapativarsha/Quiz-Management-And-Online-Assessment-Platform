import axios from '../api/axios.js'; 

const attemptService = {
  /**
   * Initializes a new quiz attempt for a student
   * @param {number} quizId - The ID of the quiz to start
   */
  startQuizAttempt: async (quizId) => {
    try {
      const response = await axios.post(`/quizzes/${quizId}/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting quiz attempt:', error);
      throw error;
    }
  } ,

  submitQuizAttempt: async (quizId, answers) => {
    try {
      const response = await axios.post(`/quizzes/${quizId}/submit`, { answers });
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  } ,

  /**
   * Fetches the entire quiz attempt history for the logged-in student.
   */
  getAttemptHistory: async () => {
    try {
      const response = await axios.get('/attempts');
      return response.data;
    } catch (error) {
      console.error('Error fetching attempt history:', error);
      throw error;
    }
  },

  /**
   * Fetches the detailed results for a specific quiz attempt.
   * @param {number} id - The ID of the attempt to fetch
   */
  getAttemptById: async (id) => {
    try {
      const response = await axios.get(`/attempts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attempt details for ID ${id}:`, error);
      throw error;
    }
  }
  
};



export default attemptService;