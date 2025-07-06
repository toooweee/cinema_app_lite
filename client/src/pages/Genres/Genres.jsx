import React, { useState, useEffect } from "react";
import { genresAPI } from "../../api/genres";
import RoleGuard from "../../components/RoleGuard/RoleGuard";
import "./Genres.css";

const GenreModal = ({
  isOpen,
  onClose,
  onSave,
  genre = null,
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
        name: genre?.name || "",
      });
      setErrors({});
    }
  }, [isOpen, genre]);

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
          <h2>{isEditing ? "Редактировать жанр" : "Создать жанр"}</h2>
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

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const data = await genresAPI.getAll();
      setGenres(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleAdd = () => {
    setEditingGenre(null);
    setIsEditing(false);
    setModalOpen(true);
  };
  const handleEdit = (genre) => {
    setEditingGenre(genre);
    setIsEditing(true);
    setModalOpen(true);
  };
  const handleSave = async (formData) => {
    if (isEditing && editingGenre) {
      await genresAPI.update(editingGenre.id, formData);
    } else {
      await genresAPI.create(formData);
    }
    await fetchGenres();
  };
  const handleDelete = async (genre) => {
    if (window.confirm(`Удалить жанр "${genre.name}"?`)) {
      await genresAPI.delete(genre.id);
      await fetchGenres();
    }
  };

  return (
    <RoleGuard allowedRoles={["Admin", "Manager"]}>
      <div className="genres-page">
        <div className="genres-content">
          <h1>Управление жанрами</h1>
          <button className="add-btn" onClick={handleAdd}>
            Добавить жанр
          </button>
          {loading ? (
            <p>Загрузка...</p>
          ) : (
            <table className="genres-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {genres.map((genre) => (
                  <tr
                    key={genre.id}
                    onClick={() => handleEdit(genre)}
                    className="genre-row"
                  >
                    <td>{genre.id}</td>
                    <td>{genre.name}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(genre);
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(genre);
                        }}
                        style={{ marginLeft: 8, color: "#d32f2f" }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <GenreModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            genre={editingGenre}
            isEditing={isEditing}
          />
        </div>
      </div>
    </RoleGuard>
  );
};

export default Genres;
