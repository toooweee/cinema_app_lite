import React, { useState, useEffect } from "react";
import { rolesAPI } from "../../api/roles";
import RoleGuard from "../../components/RoleGuard/RoleGuard";
import "./Roles.css";

const RoleModal = ({
  isOpen,
  onClose,
  onSave,
  role = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: role?.name || "",
      });
      setErrors({});
    }
  }, [isOpen, role]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Название обязательно";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Редактировать роль" : "Создать роль"}</h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            &#10005;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Название *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>
          <button type="submit" className="modal-save" disabled={loading}>
            {isEditing ? "Сохранить" : "Создать"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await rolesAPI.getAll();
      setRoles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAdd = () => {
    setEditingRole(null);
    setIsEditing(false);
    setModalOpen(true);
  };
  const handleEdit = (role) => {
    setEditingRole(role);
    setIsEditing(true);
    setModalOpen(true);
  };
  const handleSave = async (formData) => {
    if (isEditing && editingRole) {
      await rolesAPI.update(editingRole.id, formData);
    } else {
      await rolesAPI.create(formData);
    }
    await fetchRoles();
  };

  return (
    <RoleGuard allowedRoles={["Admin"]}>
      <div className="roles-page">
        <div className="roles-content">
          <h1>Управление ролями</h1>
          <button className="add-btn" onClick={handleAdd}>
            Добавить роль
          </button>
          {loading ? (
            <p>Загрузка...</p>
          ) : (
            <table className="roles-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr
                    key={role.id}
                    onClick={() => handleEdit(role)}
                    className="role-row"
                  >
                    <td>{role.id}</td>
                    <td>{role.name}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(role);
                        }}
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <RoleModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            role={editingRole}
            isEditing={isEditing}
          />
        </div>
      </div>
    </RoleGuard>
  );
};

export default Roles;
