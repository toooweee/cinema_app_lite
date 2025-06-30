import React, { useState, useEffect } from "react";
import { genresAPI } from "../../../api/genres.js";
import "./MovieModal.css";

const MovieModal = ({
  isOpen,
  onClose,
  onSave,
  movie = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    link: "",
    genres: [],
    isAvailable: true,
  });
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchGenres();
      if (isEditing && movie) {
        setFormData({
          name: movie.name || "",
          description: movie.description || "",
          link: movie.link || "",
          genres: movie.genres?.map((g) => g.id || g) || [],
          isAvailable:
            movie.isAvailable !== undefined ? movie.isAvailable : true,
        });
      } else {
        setFormData({
          name: "",
          description: "",
          link: "",
          genres: [],
          isAvailable: true,
        });
      }
      setSelectedFiles([]);
      setErrors({});
      setFileErrors("");
    }
  }, [isOpen, movie, isEditing]);

  const fetchGenres = async () => {
    try {
      const genresData = await genresAPI.getAll();
      setGenres(genresData);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Очищаем ошибку для этого поля
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      genres: checked
        ? [...prev.genres, value]
        : prev.genres.filter((genre) => genre !== value),
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileErrors("");

    // Проверяем количество файлов
    if (files.length > 5) {
      setFileErrors("Максимум 5 изображений");
      return;
    }

    // Проверяем типы файлов
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setFileErrors("Поддерживаются только изображения (JPG, PNG, WebP)");
      return;
    }

    // Проверяем размер файлов (максимум 5MB каждый)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setFileErrors("Размер каждого файла не должен превышать 5MB");
      return;
    }

    setSelectedFiles(files);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Название фильма обязательно";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Описание обязательно";
    } else if (formData.description.length < 10) {
      newErrors.description = "Описание должно содержать минимум 10 символов";
    }

    if (!formData.link.trim()) {
      newErrors.link = "Ссылка на фильм обязательна";
    } else if (!isValidUrl(formData.link)) {
      newErrors.link = "Введите корректную ссылку";
    }

    if (formData.genres.length === 0) {
      newErrors.genres = "Выберите хотя бы один жанр";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const movieData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        link: formData.link.trim(),
        genres: formData.genres,
        isAvailable: formData.isAvailable,
      };

      await onSave(movieData, selectedFiles);
      onClose();
    } catch (error) {
      console.error("Error saving movie:", error);
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
      <div
        className="modal-content movie-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{isEditing ? "Редактировать фильм" : "Добавить фильм"}</h2>
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
            <label htmlFor="name">Название фильма *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "error" : ""}
              placeholder="Введите название фильма"
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? "error" : ""}
              placeholder="Введите описание фильма"
              rows="4"
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="link">Ссылка на фильм *</label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className={errors.link ? "error" : ""}
              placeholder="https://example.com/movie"
            />
            {errors.link && (
              <span className="error-message">{errors.link}</span>
            )}
          </div>

          <div className="form-group">
            <label>Жанры *</label>
            <div className="genres-grid">
              {genres.map((genre) => (
                <label key={genre.id} className="genre-checkbox">
                  <input
                    type="checkbox"
                    value={genre.id}
                    checked={formData.genres.includes(genre.id)}
                    onChange={handleGenreChange}
                  />
                  <span className="checkbox-custom"></span>
                  {genre.name}
                </label>
              ))}
            </div>
            {errors.genres && (
              <span className="error-message">{errors.genres}</span>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
              />
              <span className="checkbox-custom"></span>
              Фильм доступен для просмотра
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="images">Изображения (максимум 5)</label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            {fileErrors && <span className="error-message">{fileErrors}</span>}

            {selectedFiles.length > 0 && (
              <div className="selected-files">
                <h4>Выбранные файлы:</h4>
                <div className="files-list">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <button
                        type="button"
                        className="remove-file"
                        onClick={() => removeFile(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
              {loading ? "Сохранение..." : isEditing ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieModal;
