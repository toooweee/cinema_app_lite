import React from "react";
import classes from "./styles/Navbar.module.css";
import { Link } from "react-router-dom";
import UserAvatar from "../UserAvatar/UserAvatar.jsx";
import { useAuth } from "../../hooks/useAuth.js";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={`${classes.navbar} container`}>
      <Link to="/movies" className={classes.logo}>
        <div className={classes.logoText}>Cinema App</div>
      </Link>

      <nav className={classes.headerNav}>
        <ul className={classes.headerNavList}>
          {isAuthenticated && (
            <>
              <li>
                <Link className={classes.headerNavLink} to="/movies">
                  Фильмы
                </Link>
              </li>
              <li>
                <Link className={classes.headerNavLink} to="/employees">
                  Сотрудники
                </Link>
              </li>
              <li>
                <Link className={classes.headerNavLink} to="/clients">
                  Клиенты
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className={classes.authSection}>
        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;
