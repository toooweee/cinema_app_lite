import React, { useState, useEffect } from "react";
import { usersAPI } from "../../api/users.js";
import { rolesAPI } from "../../api/roles.js";
import { useNotification } from "../../hooks/useNotification.js";
import { useAuth } from "../../hooks/useAuth.js";
import UserCard from "../../components/UserCard/UserCard.jsx";
import EmployeeModal from "./components/EmployeeModal.jsx";
import "./Employee.css";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const { showError, showSuccess } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      // Получаем сотрудников и роли параллельно
      const [employeesData, rolesData] = await Promise.all([
        usersAPI.getAllEmployees(),
        rolesAPI.getAll(),
      ]);

      setEmployees(employeesData);
      setRoles(rolesData);
    } catch (error) {
      console.error("Error fetching employees:", error);
      showError("Ошибка при загрузке сотрудников");
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация сотрудников
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      (employee.name &&
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.user?.email &&
        employee.user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole =
      !selectedRole || (employee.role && employee.role.id === selectedRole);

    return matchesSearch && matchesRole;
  });

  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (editingEmployee) {
        // Обновление существующего сотрудника
        await usersAPI.updateEmployee(editingEmployee.id, employeeData);
        showSuccess("Сотрудник успешно обновлен");
      } else {
        // Создание нового сотрудника
        await usersAPI.createEmployee(employeeData);
        showSuccess("Сотрудник успешно создан");
      }

      // Обновляем список сотрудников
      await fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
      const errorMessage =
        error.response?.data?.message || "Ошибка при сохранении сотрудника";
      showError(errorMessage);
      throw error; // Пробрасываем ошибку, чтобы модальное окно не закрылось
    }
  };

  const handleDeleteEmployee = async (employee) => {
    if (
      !window.confirm(
        `Вы уверены, что хотите удалить сотрудника "${employee.name || employee.user?.email}"?`
      )
    ) {
      return;
    }

    try {
      showError("Удаление сотрудников пока не поддерживается");
    } catch (error) {
      console.error("Error deleting employee:", error);
      showError("Ошибка при удалении сотрудника");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  // Проверяем права доступа
  const isAdmin =
    user?.client?.role === "Admin" || user?.employee?.role === "Admin";
  const canEdit = isAdmin;
  const canDelete = isAdmin;
  const canCreate = isAdmin;

  // Отладочная информация
  console.log("Employee Page Debug:", {
    user,
    isAdmin,
    clientRole: user?.client?.role,
    employeeRole: user?.employee?.role,
  });

  if (loading) {
    return (
      <div className="employees-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка сотрудников...</p>
      </div>
    );
  }

  return (
    <div className="employees-container">
      <div className="employees-header">
        <div className="employees-title-section">
          <h1>Сотрудники</h1>
          <p>Управление персоналом кинотеатра</p>
        </div>

        {canCreate && (
          <button
            className="create-employee-btn"
            onClick={handleCreateEmployee}
          >
            <span className="btn-icon">+</span>
            Добавить сотрудника
          </button>
        )}
      </div>

      <div className="employees-filters">
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

      <div className="employees-content">
        {filteredEmployees.length === 0 ? (
          <div className="no-employees">
            <div className="no-employees-icon">👨‍💼</div>
            <h3>Сотрудники не найдены</h3>
            <p>
              {searchTerm || selectedRole
                ? "Попробуйте изменить параметры поиска"
                : "В системе пока нет сотрудников"}
            </p>
          </div>
        ) : (
          <div className="employees-grid">
            {filteredEmployees.map((employee) => (
              <UserCard
                key={employee.id}
                user={employee}
                type="employee"
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            ))}
          </div>
        )}
      </div>

      <div className="employees-stats">
        <div className="stat-item">
          <span className="stat-label">Всего сотрудников:</span>
          <span className="stat-value">{employees.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Активных:</span>
          <span className="stat-value">
            {employees.filter((emp) => !emp.dismissalDate).length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Уволенных:</span>
          <span className="stat-value">
            {employees.filter((emp) => emp.dismissalDate).length}
          </span>
        </div>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
        isEditing={!!editingEmployee}
      />
    </div>
  );
};

export default Employee;
