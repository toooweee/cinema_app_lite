import React, { useState, useEffect } from "react";
import { rolesAPI } from "../../../api/roles.js";
import "./EmployeeModal.css";

const EmployeeModal = ({
  isOpen,
  onClose,
  onSave,
  employee = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    employmentDate: "",
    roleId: "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      if (isEditing && employee) {
        setFormData({
          name: employee.name || "",
          email: employee.user?.email || "",
          password: "", // Пароль не заполняем при редактировании
          employmentDate: employee.employmentDate
            ? new Date(employee.employmentDate).toISOString().split("T")[0]
            : "",
          roleId: employee.role?.id || "",
        });
      } else {
        setFormData({
          name: "",
          email: "",
          password: "",
          employmentDate: "",
          roleId: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, employee, isEditing]);

  const fetchRoles = async () => {
    try {
      const rolesData = await rolesAPI.getAll();
      setRoles(rolesData);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Очищаем ошибку для этого поля
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно для заполнения";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен для заполнения";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!isEditing && !formData.password.trim()) {
      newErrors.password = "Пароль обязателен для заполнения";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (!formData.employmentDate) {
      newErrors.employmentDate = "Дата приема обязательна";
    }

    if (!formData.roleId) {
      newErrors.roleId = "Выберите роль";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const employeeData = {
        name: formData.name.trim(),
        employmentDate: new Date(formData.employmentDate).toISOString(),
        roleId: formData.roleId,
        user: {
          email: formData.email.trim(),
          ...(formData.password && { password: formData.password }),
        },
      };

      await onSave(employeeData);
      onClose();
    } catch (error) {
      console.error("Error saving employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {isEditing ? "Редактировать сотрудника" : "Создать сотрудника"}
          </h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Имя *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "error" : ""}
              placeholder="Введите имя сотрудника"
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "error" : ""}
              placeholder="Введите email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль {!isEditing && "*"}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? "error" : ""}
              placeholder={
                isEditing
                  ? "Оставьте пустым, чтобы не менять"
                  : "Введите пароль"
              }
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="employmentDate">Дата приема *</label>
            <input
              type="date"
              id="employmentDate"
              name="employmentDate"
              value={formData.employmentDate}
              onChange={handleInputChange}
              className={errors.employmentDate ? "error" : ""}
            />
            {errors.employmentDate && (
              <span className="error-message">{errors.employmentDate}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="roleId">Роль *</label>
            <select
              id="roleId"
              name="roleId"
              value={formData.roleId}
              onChange={handleInputChange}
              className={errors.roleId ? "error" : ""}
            >
              <option value="">Выберите роль</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.roleId && (
              <span className="error-message">{errors.roleId}</span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Отмена
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Сохранение..." : isEditing ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
