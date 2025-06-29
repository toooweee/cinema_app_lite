import React, { useState } from "react";
import { testAPI } from "../../api/test.js";
import "./APITest.css";

const APITest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const runTest = async (testName, testFunction) => {
    setLoading((prev) => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setResults((prev) => ({
        ...prev,
        [testName]: { success: true, data: result },
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [testName]: { success: false, error: error.message },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [testName]: false }));
    }
  };

  return (
    <div className="api-test">
      <h2>API Тесты</h2>

      <div className="test-buttons">
        <button
          onClick={() => runTest("connection", testAPI.testConnection)}
          disabled={loading.connection}
        >
          {loading.connection ? "Тестирование..." : "Тест подключения"}
        </button>

        <button
          onClick={() => runTest("protected", testAPI.testProtected)}
          disabled={loading.protected}
        >
          {loading.protected ? "Тестирование..." : "Тест защищенного эндпоинта"}
        </button>

        <button
          onClick={() => runTest("refresh", testAPI.testRefresh)}
          disabled={loading.refresh}
        >
          {loading.refresh ? "Тестирование..." : "Тест обновления токена"}
        </button>
      </div>

      <div className="test-results">
        {Object.entries(results).map(([testName, result]) => (
          <div
            key={testName}
            className={`test-result ${result.success ? "success" : "error"}`}
          >
            <h3>{testName}</h3>
            {result.success ? (
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            ) : (
              <p>Ошибка: {result.error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default APITest;
