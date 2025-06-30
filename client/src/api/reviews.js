import api from "./axios.js";

export const reviewsAPI = {
  // Получить все отзывы
  getAll: async () => {
    const response = await api.get("/reviews");
    return response.data;
  },

  // Получить отзыв по ID
  getById: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  // Создать новый отзыв
  create: async (movieId, reviewData) => {
    const response = await api.post("/reviews", {
      ...reviewData,
      movieId: movieId,
    });
    return response.data;
  },

  // Обновить отзыв
  update: async (id, reviewData) => {
    const response = await api.patch(`/reviews/${id}`, reviewData);
    return response.data;
  },

  // Удалить отзыв
  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};
