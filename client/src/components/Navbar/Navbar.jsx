import React from "react";
import classes from "./styles/Navbar.module.css";
import { Link } from "react-router-dom";
import UserAvatar from "../UserAvatar/UserAvatar.jsx";
import { useAuth } from "../../hooks/useAuth.js";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  // Определяем роль пользователя
  const userRole = (
    user?.employee?.role ||
    user?.client?.role ||
    ""
  ).toUpperCase();

  let navLinks = [];
  if (isAuthenticated) {
    if (userRole === "ADMIN") {
      navLinks = [
        { to: "/employees", label: "Сотрудники" },
        { to: "/clients", label: "Клиенты" },
        { to: "/roles", label: "Роли" },
        { to: "/genres", label: "Жанры" },
      ];
    } else if (userRole === "MANAGER") {
      navLinks = [
        { to: "/clients", label: "Клиенты" },
        { to: "/genres", label: "Жанры" },
      ];
    } // Для Client и остальных — пусто
  }

  return (
    <div className={`${classes.navbar} container`}>
      <Link to="/movies" className={classes.logo}>
        <div className={classes.logoText}>Cinema App</div>
      </Link>

      <nav className={classes.headerNav}>
        <ul className={classes.headerNavList}>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link className={classes.headerNavLink} to={link.to}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={classes.authSection}>
        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;
