import React, { useState, useEffect } from "react";
import { usersAPI } from "../../api/users.js";
import { rolesAPI } from "../../api/roles.js";
import { useNotification } from "../../hooks/useNotification.js";
import { useAuth } from "../../hooks/useAuth.js";
import UserCard from "../../components/UserCard/UserCard.jsx";
import "./Client.css";

const Client = () => {
  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const { showError, showSuccess } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);

      // Получаем клиентов и роли параллельно
      const [clientsData, rolesData] = await Promise.all([
        usersAPI.getAllClients(),
        rolesAPI.getAll(),
      ]);

      setClients(clientsData);
      setRoles(rolesData);
    } catch (error) {
      console.error("Error fetching clients:", error);
      showError("Ошибка при загрузке клиентов");
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация клиентов
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      (client.name &&
        client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.user?.email &&
        client.user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole =
      !selectedRole || (client.role && client.role.id === selectedRole);

    return matchesSearch && matchesRole;
  });

  const handleDeleteClient = async (client) => {
    if (
      !window.confirm(
        `Вы уверены, что хотите удалить клиента "${client.name || client.user?.email}"?`
      )
    ) {
      return;
    }

    try {
      await usersAPI.deleteClient(client.id);
      await fetchClients();
      showSuccess("Клиент успешно удален");
    } catch (error) {
      console.error("Error deleting client:", error);
      showError("Ошибка при удалении клиента");
    }
  };

  // Проверяем права доступа
  const isAdmin =
    user?.client?.role === "Admin" || user?.employee?.role === "Admin";
  const isManager =
    user?.client?.role === "Manager" || user?.employee?.role === "Manager";
  const canDelete = isAdmin;
  const canView = isAdmin || isManager;

  // Отладка
  console.log("user:", user);
  console.log(
    "isAdmin:",
    isAdmin,
    "isManager:",
    isManager,
    "canDelete:",
    canDelete
  );

  // Проверяем доступ к странице
  if (!canView) {
    return (
      <div className="clients-loading">
        <div className="no-clients-icon">🚫</div>
        <h3>Доступ запрещен</h3>
        <p>У вас нет прав для просмотра этой страницы</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="clients-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка клиентов...</p>
      </div>
    );
  }

  return (
    <div className="clients-container">
      <div className="clients-header">
        <div className="clients-title-section">
          <h1>Клиенты</h1>
          <p>
            {isAdmin
              ? "Управление клиентской базой кинотеатра"
              : "Просмотр клиентской базы кинотеатра"}
          </p>
        </div>

        <div className="clients-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="role-filter"
          >
            <option value="">Все роли</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="clients-content">
        {filteredClients.length === 0 ? (
          <div className="no-clients">
            <div className="no-clients-icon">👤</div>
            <h3>Клиенты не найдены</h3>
            <p>
              {searchTerm || selectedRole
                ? "Попробуйте изменить параметры поиска"
                : "В системе пока нет клиентов"}
            </p>
          </div>
        ) : (
          <div className="clients-grid">
            {filteredClients.map((client) => (
              <UserCard
                key={client.id}
                user={client}
                type="client"
                onDelete={handleDeleteClient}
                canDelete={canDelete}
              />
            ))}
          </div>
        )}
      </div>

      <div className="clients-stats">
        <div className="stat-item">
          <span className="stat-label">Всего клиентов:</span>
          <span className="stat-value">{clients.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">С отзывами:</span>
          <span className="stat-value">
            {
              clients.filter(
                (client) =>
                  client.user?.reviews && client.user.reviews.length > 0
              ).length
            }
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Активных:</span>
          <span className="stat-value">
            {clients.filter((client) => client.user?.isActivated).length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Ваши права:</span>
          <span className="stat-value">
            {isAdmin
              ? "Администратор"
              : isManager
                ? "Менеджер"
                : "Пользователь"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Client;
