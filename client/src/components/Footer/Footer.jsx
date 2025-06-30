import React from "react";
import { Link } from "react-router-dom";
import "./styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
            <li>
              <Link to="/movies">Фильмы</Link>
            </li>
            <li>
              <Link to="/profile">Профиль</Link>
            </li>
            <li>
              <Link to="/employees">Сотрудники</Link>
            </li>
            <li>
              <Link to="/clients">Клиенты</Link>
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
            <a href="#">Политика конфиденциальности</a>
            <span className="separator">•</span>
            <a href="#">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
