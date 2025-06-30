import React from "react";
import "./UserCard.css";

const UserCard = ({
  user,
  type = "client",
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
}) => {
  const {
    id,
    name,
    role,
    employmentDate,
    dismissalDate,
    dateOfBirth,
    user: userData,
    createdAt,
  } = user;

  // Определяем тип пользователя и соответствующие данные
  const isEmployee = type === "employee";
  const displayName = name || userData?.email || "Без имени";
  const email = userData?.email || "Email не указан";
  const roleName = role || "Не указана";

  // Форматируем даты
  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  // Вычисляем возраст для клиентов
  const getAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Статус сотрудника
  const getEmployeeStatus = () => {
    if (dismissalDate) {
      return { text: "Уволен", class: "status-dismissed" };
    }
    return { text: "Работает", class: "status-active" };
  };

  const employeeStatus = isEmployee ? getEmployeeStatus() : null;
  const clientAge = !isEmployee && dateOfBirth ? getAge(dateOfBirth) : null;

  return (
    <div className="user-card">
      <div className="user-card-header">
        <div className="user-avatar">
          <span className="avatar-icon">{isEmployee ? "👨‍💼" : "👤"}</span>
        </div>

        <div className="user-info">
          <h3 className="user-name">{displayName}</h3>
          <p className="user-email">{email}</p>
          <div className="user-role">
            <span className="role-badge">{roleName}</span>
            {isEmployee && employeeStatus && (
              <span className={`status-badge ${employeeStatus.class}`}>
                {employeeStatus.text}
              </span>
            )}
          </div>
        </div>

        {(canEdit || canDelete) && (
          <div className="user-actions">
            {canEdit && (
              <button
                className="action-button edit"
                onClick={() => onEdit(user)}
                title="Редактировать"
              >
                ✏️
              </button>
            )}
            {canDelete && (
              <button
                className="action-button delete"
                onClick={() => onDelete(user)}
                title="Удалить"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>

      <div className="user-card-details">
        {isEmployee ? (
          <>
            <div className="detail-item">
              <span className="detail-label">Дата приема:</span>
              <span className="detail-value">{formatDate(employmentDate)}</span>
            </div>
            {dismissalDate && (
              <div className="detail-item">
                <span className="detail-label">Дата увольнения:</span>
                <span className="detail-value">
                  {formatDate(dismissalDate)}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            {dateOfBirth && (
              <div className="detail-item">
                <span className="detail-label">Дата рождения:</span>
                <span className="detail-value">
                  {formatDate(dateOfBirth)} ({clientAge} лет)
                </span>
              </div>
            )}
          </>
        )}

        <div className="detail-item">
          <span className="detail-label">Дата регистрации:</span>
          <span className="detail-value">{formatDate(createdAt)}</span>
        </div>
      </div>

      <div className="user-card-footer">
        <div className="user-id">ID: {id}</div>
      </div>
    </div>
  );
};

export default UserCard;
