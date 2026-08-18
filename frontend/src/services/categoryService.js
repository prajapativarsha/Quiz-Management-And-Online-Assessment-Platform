import axios from '../api/axios.js'; 

const categoryService = {
  // Fetch all categories
  getAllCategories: async () => {
    const response = await axios.get('/categories');
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await axios.get(`/categories/${id}`);
    return response.data;
  },
  
  // Create a new category
  createCategory: async (categoryData) => {
    const response = await axios.post('/categories', categoryData);
    return response.data;
  },

  // Update an existing category
  updateCategory: async (id, categoryData) => {
    const response = await axios.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete a category
  deleteCategory: async (id) => {
    const response = await axios.delete(`/categories/${id}`);
    return response.data;
  }
};

export default categoryService;