import React from "react";
import { Link } from "react-router-dom";
import classes from "./styles/Error.module.css";

const Error = () => {
  return (
    <div className={classes.wrapper}>
      <h1 className={classes.title}>404</h1>
      <p className={classes.subtitle}>Страница не найдена</p>
      <Link to="/movies" className={classes.link}>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default Error;
