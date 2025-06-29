import api from "./axios.js";

export const moviesAPI = {
  // Получить все фильмы
  getAll: async () => {
    const response = await api.get("/movies");
    return response.data;
  },

  // Получить один фильм по ID
  getById: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  // Создать новый фильм (только для админов/менеджеров)
  create: async (movieData) => {
    const response = await api.post("/movies", movieData);
    return response.data;
  },

  // Обновить фильм (только для админов/менеджеров)
  update: async (id, movieData) => {
    const response = await api.patch(`/movies/${id}`, movieData);
    return response.data;
  },

  // Добавить изображения к фильму (только для админов/менеджеров)
  addImages: async (id, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.patch(`/movies/images/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
