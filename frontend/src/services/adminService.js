import axios from "../api/axios.js";  

export const getDashboardStats = () => axios.get("/admin/stats");
export const getUsers = (params) => axios.get("/admin/users", { params });
export const updateUserRole = (id, role) => axios.put(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => axios.delete(`/admin/users/${id}`);

export const getAnalytics = async (data) => {
    try {
      const response = await axios.get('/admin/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin analytics:', error);
      throw error;
    }
  }