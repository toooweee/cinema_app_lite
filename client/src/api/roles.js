import api from "./axios.js";

export const rolesAPI = {
  // Получить все роли (только для админов)
  getAll: async () => {
    const response = await api.get("/roles");
    return response.data;
  },

  // Создать новую роль (только для админов)
  create: async (roleData) => {
    const response = await api.post("/roles", roleData);
    return response.data;
  },

  // Обновить роль (только для админов)
  update: async (id, roleData) => {
    const response = await api.patch(`/roles/${id}`, roleData);
    return response.data;
  },
};
