import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useNotification } from "../../hooks/useNotification.js";
import "./UserAvatar.css";

const UserAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Закрываем дропдаун при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess("Вы успешно вышли из системы");
      navigate("/auth");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    setIsOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <Link className="login-button" to="/auth">
        Войти
      </Link>
    );
  }

  // Получаем первую букву имени или email для аватара
  const getInitials = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="user-avatar-container" ref={dropdownRef}>
      <button className="avatar-button" onClick={toggleDropdown}>
        <div className="avatar">{getInitials()}</div>
        <span className="avatar-name">
          {user?.name || user?.email?.split("@")[0] || "Пользователь"}
        </span>
        <svg
          className={`dropdown-arrow ${isOpen ? "open" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <div className="dropdown-avatar">{getInitials()}</div>
            <div className="dropdown-user-info">
              <div className="dropdown-name">
                {user?.name || "Пользователь"}
              </div>
              <div className="dropdown-email">{user?.email}</div>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <Link
            to="/profile"
            className="dropdown-item"
            onClick={handleProfileClick}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 8c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.65 0-8 1.35-8 4v2h16v-2c0-2.65-5.35-4-8-4z" />
            </svg>
            Профиль
          </Link>

          <button className="dropdown-item logout-item" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12 10V8H6V6H12V4L16 7L12 10ZM10 12V10H8V8H10V6H2V12H10Z" />
            </svg>
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
