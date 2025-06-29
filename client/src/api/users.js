import api from "./axios.js";

export const usersAPI = {
  // Получить информацию о текущем пользователе
  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Получить всех сотрудников (только для админов и менеджеров)
  getAllEmployees: async () => {
    const response = await api.get("/employees");
    return response.data;
  },

  // Получить одного сотрудника (только для админов)
  getEmployeeById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Создать нового сотрудника (только для админов)
  createEmployee: async (employeeData) => {
    const response = await api.post("/employees", employeeData);
    return response.data;
  },

  // Обновить сотрудника (только для админов)
  updateEmployee: async (id, employeeData) => {
    const response = await api.patch(`/employees/${id}`, employeeData);
    return response.data;
  },

  // Получить всех клиентов (только для админов и менеджеров)
  getAllClients: async () => {
    const response = await api.get("/clients");
    return response.data;
  },

  // Получить одного клиента (только для админов и менеджеров)
  getClientById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  // Удалить клиента (только для админов)
  deleteClient: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },

  // Получить профиль текущего пользователя
  getMyProfile: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },
};
