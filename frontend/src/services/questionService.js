import axios from '../api/axios.js'; 

const questionService = {
  // Fetch all questions for a specific quiz
  getQuestionsByQuiz: async (quizId) => {
    const response = await axios.get(`/quizzes/${quizId}/questions`);
    return response.data;
  },

  // Create a new question (and its options) for a specific quiz
  createQuestion: async (quizId, questionData) => {
    const response = await axios.post(`/quizzes/${quizId}/questions`, questionData);
    return response.data;
  },

  // Update a specific question and its options
  updateQuestion: async (id, questionData) => {
    const response = await axios.put(`/questions/${id}`, questionData);
    return response.data;
  },

  // Delete a specific question
  deleteQuestion: async (id) => {
    const response = await axios.delete(`/questions/${id}`);
    return response.data;
  }
};

export default questionService;