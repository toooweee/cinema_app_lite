import api from "./axios.js";

export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  login: async (userData) => {
    const response = await api.post("/auth/login", userData);
    return response.data;
  },

  refresh: async () => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  },
};
