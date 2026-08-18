import axios from '../api/axios.js';

const API_URL = '/quizzes'; 

const quizService = {
  
  //------------------------------- General / Student Functions---------------------------//
  
  // Fetch all quizzes (Backend handles filtering based on role)
  getAllQuizzes: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Fetch a single quiz by its ID
  getQuizById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  /**
   * Fetches all quizzes and filters for only "PUBLISHED" status 
   * for the Student Quiz Discovery page.
   */
  getPublishedQuizzes: async () => {
    try {
      // Fetch all quizzes from the existing endpoint
      const response = await axios.get(API_URL);
      
      // Filter out anything that isn't published directly on the frontend
      const publishedQuizzes = response.data.filter(
        (quiz) => quiz.status === 'PUBLISHED'
      );
      
      return publishedQuizzes;
    } catch (error) {
      console.error('Error fetching published quizzes:', error);
      throw error;
    }
  },

  
  //-------------------------------------- Admin-Only Functions----------------------------//
  

  // Create a new quiz
  createQuiz: async (quizData) => {
    const response = await axios.post(API_URL, quizData);
    return response.data;
  },

  // Update an existing quiz
  updateQuiz: async (id, quizData) => {
    const response = await axios.put(`${API_URL}/${id}`, quizData);
    return response.data;
  },

  // Delete a quiz
  deleteQuiz: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  // Update a quiz's status ('DRAFT', 'PUBLISHED', 'UNPUBLISHED')
  updateQuizStatus: async (id, status) => {
    // We send the status inside an object because the backend expects req.body.status
    const response = await axios.patch(`${API_URL}/${id}/publish`, { status });
    return response.data;
  }
};

export default quizService;