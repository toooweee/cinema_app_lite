import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, user } = useAuth();

  // Определяем роль пользователя
  const userRole = (
    user?.employee?.role ||
    user?.client?.role ||
    user?.role?.name ||
    ""
  ).toUpperCase();

  let navLinks = [];
  if (isAuthenticated) {
    if (userRole === "ADMIN") {
      navLinks = [
        { to: "/movies", label: "Фильмы" },
        { to: "/employees", label: "Сотрудники" },
        { to: "/clients", label: "Клиенты" },
        { to: "/roles", label: "Роли" },
        { to: "/genres", label: "Жанры" },
        { to: "/profile", label: "Профиль" },
      ];
    } else if (userRole === "MANAGER") {
      navLinks = [
        { to: "/movies", label: "Фильмы" },
        { to: "/clients", label: "Клиенты" },
        { to: "/genres", label: "Жанры" },
        { to: "/profile", label: "Профиль" },
      ];
    } else {
      navLinks = [
        { to: "/movies", label: "Фильмы" },
        { to: "/profile", label: "Профиль" },
      ];
    }
  } else {
    navLinks = [{ to: "/movies", label: "Фильмы" }];
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <h3>🎬 Cinema App</h3>
            <p>Лучшие фильмы в лучшем качестве</p>
          </div>
          <div className="footer-social">
            <a href="#" className="social-link" title="Telegram">
              📱
            </a>
            <a href="#" className="social-link" title="VK">
              💬
            </a>
            <a href="#" className="social-link" title="Instagram">
              📸
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Навигация</h4>
          <ul className="footer-links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/privacy">Политика конфиденциальности</Link>
            </li>
            <li>
              <Link to="/terms">Условия пользования</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Информация</h4>
          <ul className="footer-links">
            <li>
              <a href="#">О нас</a>
            </li>
            <li>
              <a href="#">Контакты</a>
            </li>
            <li>
              <a href="#">Правила</a>
            </li>
            <li>
              <a href="#">Помощь</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Контакты</h4>
          <div className="contact-info">
            <p>📍 ул. Кинотеатральная, 123</p>
            <p>📞 +7 (999) 123-45-67</p>
            <p>✉️ info@cinema-app.ru</p>
            <p>🕒 Ежедневно 9:00 - 23:00</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} Cinema App. Все права защищены.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Политика конфиденциальности</Link>
            <span className="separator">•</span>
            <Link to="/terms">Условия пользования</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
