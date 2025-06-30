import api from "./axios.js";

export const genresAPI = {
  // Получить все жанры
  getAll: async () => {
    const response = await api.get("/genres");
    return response.data;
  },

  // Получить жанр по ID
  getById: async (id) => {
    const response = await api.get(`/genres/${id}`);
    return response.data;
  },

  // Создать новый жанр (только для админов)
  create: async (genreData) => {
    const response = await api.post("/genres", genreData);
    return response.data;
  },

  // Обновить жанр (только для админов)
  update: async (id, genreData) => {
    const response = await api.patch(`/genres/${id}`, genreData);
    return response.data;
  },

  // Удалить жанр (только для админов)
  delete: async (id) => {
    const response = await api.delete(`/genres/${id}`);
    return response.data;
  },
};
