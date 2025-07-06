import React, { createContext, useState, useEffect } from "react";
import { authAPI } from "../api/auth.js";
import { usersAPI } from "../api/users.js";

const AuthContext = createContext();

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для получения полной информации о пользователе
  const fetchUserInfo = async () => {
    try {
      const userData = await usersAPI.getCurrentUser();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  };

  // Проверяем токен при загрузке приложения
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        try {
          // Пытаемся обновить токен для проверки валидности
          await authAPI.refresh();
          // Получаем актуальную информацию о пользователе
          await fetchUserInfo();
        } catch (error) {
          console.error("Auth initialization error:", error);
          // Если токен невалиден, очищаем localStorage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });

      // Проверяем, есть ли accessToken в ответе
      if (!response.accessToken) {
        throw new Error("Токен не найден в ответе сервера");
      }

      localStorage.setItem("accessToken", response.accessToken);

      // Получаем полную информацию о пользователе
      await fetchUserInfo();

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Ошибка входа";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email, password, name) => {
    try {
      setError(null);
      const response = await authAPI.register({ email, password, name });

      localStorage.setItem("accessToken", response.accessToken);

      // Получаем полную информацию о пользователе
      await fetchUserInfo();

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Ошибка регистрации";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      setUser(null);
      setError(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Обновить пользователя вручную (например, после загрузки аватарки)
  const updateUser = async () => {
    return await fetchUserInfo();
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
