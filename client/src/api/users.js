import api from "./axios.js";

export const usersAPI = {
  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  getAllEmployees: async () => {
    const response = await api.get("/employees");
    return response.data;
  },

  getEmployeeById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  createEmployee: async (employeeData) => {
    const response = await api.post("/employees", employeeData);
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const response = await api.patch(`/employees/${id}`, employeeData);
    return response.data;
  },

  dismissEmployee: async (id) => {
    const response = await api.patch(`/employees/${id}`, {
      dismissalDate: new Date().toISOString(),
    });
    return response.data;
  },

  getAllClients: async () => {
    const response = await api.get("/clients");
    return response.data;
  },

  getClientById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  deleteClient: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },

  uploadAvatar: async (formData) => {
    const response = await api.patch("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
