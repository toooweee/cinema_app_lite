import React from "react";

const Terms = () => (
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
    <h1 style={{ color: "#00d4ff", marginBottom: 24 }}>Условия пользования</h1>
    <p>
      Используя Cinema App, вы соглашаетесь соблюдать правила и условия,
      установленные администрацией сервиса.
    </p>
    <p>
      Запрещено использовать сервис для противоправных целей, а также нарушать
      права других пользователей.
    </p>
    <p>
      Администрация оставляет за собой право изменять условия пользования без
      предварительного уведомления.
    </p>
    <p style={{ marginTop: 32, color: "#aaa" }}>Последнее обновление: 2025</p>
  </div>
);

export default Terms;
