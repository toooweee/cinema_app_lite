import React, { useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { usersAPI } from "../../api/users.js";
import { useNotification } from "../../hooks/useNotification.js";
import "./Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);
    try {
      await usersAPI.uploadAvatar(formData);
      showSuccess("Аватарка успешно загружена");
      await updateUser();
    } catch {
      showError("Ошибка при загрузке аватарки");
    } finally {
      setUploading(false);
    }
  };

  // Получаем список аватарок (пути)
  const avatars = user.avatars || [];
  const lastAvatar =
    avatars.length > 0 ? avatars[avatars.length - 1].path : null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {lastAvatar ? (
              <img
                src={`http://localhost:3000/${lastAvatar}`}
                alt="avatar"
                className="profile-avatar-img"
              />
            ) : user.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              user.email.charAt(0).toUpperCase()
            )}
          </div>
          <h1>Профиль пользователя</h1>
        </div>

        <div className="profile-info">
          <div className="info-group">
            <label>Имя:</label>
            <span>
              {user.name ||
                user.client?.name ||
                user.employee?.name ||
                "Не указано"}
            </span>
          </div>

          <div className="info-group">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>

          <div className="info-group">
            <label>ID пользователя:</label>
            <span>{user.id || "Не указано"}</span>
          </div>

          <div className="info-group">
            <label>Роль:</label>
            <span>
              {user.employee?.role ||
                user.client?.role ||
                user.role ||
                "Пользователь"}
            </span>
          </div>

          <div className="info-group">
            <label>Аккаунт активирован:</label>
            <span>{user.isActivated ? "Да" : "Нет"}</span>
          </div>

          {user.employee && (
            <div className="info-group">
              <label>Сотрудник:</label>
              <span>
                {user.employee.name} (ID: {user.employee.id})<br />
                Роль: {user.employee.role}
                <br />
                Дата приёма:{" "}
                {user.employee.employmentDate
                  ? new Date(user.employee.employmentDate).toLocaleDateString(
                      "ru-RU"
                    )
                  : "-"}
              </span>
            </div>
          )}
          {user.client && (
            <div className="info-group">
              <label>Клиент:</label>
              <span>
                {user.client.name} (ID: {user.client.id})<br />
                Роль: {user.client.role}
                <br />
                Дата рождения:{" "}
                {user.client.dateOfBirth
                  ? new Date(user.client.dateOfBirth).toLocaleDateString(
                      "ru-RU"
                    )
                  : "-"}
              </span>
            </div>
          )}

          <div className="info-group">
            <label>Дата регистрации:</label>
            <span>
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("ru-RU")
                : "Не указано"}
            </span>
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-button">Редактировать профиль</button>
        </div>

        <div className="profile-avatars-block">
          <h3>Ваши аватарки</h3>
          <div className="profile-avatars-list">
            {avatars.length === 0 ? (
              <span className="profile-avatars-empty">
                Нет загруженных аватарок
              </span>
            ) : (
              avatars.map((a, idx) => (
                <img
                  key={a.id || a.path || idx}
                  src={`http://localhost:3000/${a.path}`}
                  alt="avatar"
                  className={`profile-avatar-img${idx === avatars.length - 1 ? " profile-avatar-img-main" : ""}`}
                />
              ))
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            disabled={uploading}
          />
          <button
            className="upload-avatar-btn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={uploading}
          >
            {uploading ? "Загрузка..." : "Загрузить аватарку"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
