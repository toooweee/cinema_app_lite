import React from "react";
import "./UserCard.css";

const UserCard = ({
  user,
  type = "client",
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
  } = user;

  // Определяем тип пользователя и соответствующие данные
  const isEmployee = type === "employee";
  const displayName = name || userData?.email || "Без имени";
  const email = userData?.email || "Email не указан";
  const roleName =
    typeof role === "object" && role !== null
      ? role.name
      : role || "Не указана";

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

  // Получить ссылку на аватарку
  const getAvatarUrl = () => {
    if (userData?.avatars && userData.avatars.length > 0) {
      const last = userData.avatars[userData.avatars.length - 1];
      return `http://localhost:3000/${last.path}`;
    }
    return null;
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <div className="user-avatar">
          {getAvatarUrl() ? (
            <img src={getAvatarUrl()} alt="avatar" className="avatar-img" />
          ) : (
            <span className="avatar-icon">{isEmployee ? "🧳" : "👤"}</span>
          )}
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
            {canDelete && (
              <button
                className="action-button delete"
                onClick={() => onDelete(user)}
                title={isEmployee ? "Уволить" : "Удалить"}
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
          <span className="detail-value">
            {formatDate(userData?.createdAt)}
          </span>
        </div>
      </div>

      <div className="user-card-footer">
        <div className="user-id">ID: {id}</div>
      </div>
    </div>
  );
};

export default UserCard;
