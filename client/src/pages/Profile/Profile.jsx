import React from "react";
import { useAuth } from "../../hooks/useAuth.js";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </div>
          <h1>Профиль пользователя</h1>
        </div>

        <div className="profile-info">
          <div className="info-group">
            <label>Имя:</label>
            <span>{user.name || "Не указано"}</span>
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
            <span>{user.role || "Пользователь"}</span>
          </div>

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
      </div>
    </div>
  );
};

export default Profile;
