import React from "react";
import { useAuth } from "../../hooks/useAuth.js";
import "./RoleGuard.css";

const RoleGuard = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  // Если пользователь не аутентифицирован, показываем сообщение
  if (!isAuthenticated) {
    return (
      <div className="role-guard-error">
        <div className="error-icon">🔒</div>
        <h2>Доступ запрещен</h2>
        <p>Для доступа к этой странице необходимо войти в систему</p>
      </div>
    );
  }

  // Определяем роль пользователя из новой структуры данных
  let userRole = null;

  if (user?.client?.role) {
    userRole = user.client.role.name;
  } else if (user?.employee?.role) {
    userRole = user.employee.role.name;
  }

  // Отладочная информация
  console.log("RoleGuard Debug:", {
    user,
    userRole,
    allowedRoles,
    hasClient: !!user?.client,
    hasEmployee: !!user?.employee,
    clientRole: user?.client?.role?.name,
    employeeRole: user?.employee?.role?.name,
  });

  // Если роль не найдена, показываем сообщение с отладочной информацией
  if (!userRole) {
    return (
      <div className="role-guard-error">
        <div className="error-icon">⚠️</div>
        <h2>Ошибка доступа</h2>
        <p>Не удалось определить роль пользователя</p>
        <div className="debug-info">
          <p>
            <strong>Отладочная информация:</strong>
          </p>
          <p>Email: {user?.email}</p>
          <p>Есть client: {user?.client ? "Да" : "Нет"}</p>
          <p>Есть employee: {user?.employee ? "Да" : "Нет"}</p>
          <p>Client role: {user?.client?.role?.name || "Не найдена"}</p>
          <p>Employee role: {user?.employee?.role?.name || "Не найдена"}</p>
        </div>
      </div>
    );
  }

  // Проверяем, есть ли у пользователя необходимая роль
  const hasAccess =
    allowedRoles.length === 0 || allowedRoles.includes(userRole);

  if (!hasAccess) {
    return (
      <div className="role-guard-error">
        <div className="error-icon">🚫</div>
        <h2>Доступ запрещен</h2>
        <p>
          У вас нет прав для доступа к этой странице. Требуемые роли:{" "}
          {allowedRoles.join(", ")}
        </p>
        <p>Ваша роль: {userRole}</p>
      </div>
    );
  }

  return children;
};

export default RoleGuard;
