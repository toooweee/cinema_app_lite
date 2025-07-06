import React from "react";

const Privacy = () => (
  <div
    style={{
      maxWidth: 800,
      margin: "40px auto",
      padding: 24,
      background: "rgba(20, 24, 40, 0.95)",
      borderRadius: 16,
      color: "#fff",
      boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
      fontSize: 18,
      lineHeight: 1.7,
    }}
  >
    <h1 style={{ color: "#00d4ff", marginBottom: 24 }}>
      Политика конфиденциальности
    </h1>
    <p>
      Мы уважаем вашу конфиденциальность и не передаем ваши данные третьим лицам
      без вашего согласия.
    </p>
    <p>
      Все персональные данные используются только для предоставления сервисов
      Cinema App и улучшения качества обслуживания.
    </p>
    <p>
      Вы можете запросить удаление своих данных, написав на{" "}
      <a href="mailto:info@cinema-app.ru" style={{ color: "#00d4ff" }}>
        info@cinema-app.ru
      </a>
      .
    </p>
    <p style={{ marginTop: 32, color: "#aaa" }}>Последнее обновление: 2024</p>
  </div>
);

export default Privacy;
