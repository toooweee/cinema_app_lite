import api from "./axios.js";

// Тестовые функции для проверки API
export const testAPI = {
  // Проверка подключения к серверу
  testConnection: async () => {
    try {
      const response = await api.get("/");
      console.log("API Connection:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Connection Error:", error.message);
      throw error;
    }
  },

  // Тест защищенного эндпоинта
  testProtected: async () => {
    try {
      const response = await api.get("/protected");
      console.log("Protected Endpoint:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Protected Endpoint Error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },

  // Тест обновления токена
  testRefresh: async () => {
    try {
      const response = await api.post("/refresh");
      console.log("Token Refresh:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Token Refresh Error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },
};
