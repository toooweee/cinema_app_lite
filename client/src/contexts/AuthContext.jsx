import React, { createContext, useState, useEffect } from "react";
import { authAPI } from "../api/auth.js";

const AuthContext = createContext();

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Проверяем токен при загрузке приложения
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          // Пытаемся обновить токен для проверки валидности
          await authAPI.refresh();
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch {
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

      // Проверяем, есть ли user в ответе
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
      } else {
        // Создаем базовый объект пользователя
        const basicUser = { email, name: email.split("@")[0] };
        localStorage.setItem("user", JSON.stringify(basicUser));
        setUser(basicUser);
      }

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

      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
      } else {
        const basicUser = { email, name: name || email.split("@")[0] };
        localStorage.setItem("user", JSON.stringify(basicUser));
        setUser(basicUser);
      }

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
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
