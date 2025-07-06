import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { useNotification } from "../../hooks/useNotification.js";
import { reviewsAPI } from "../../api/reviews.js";
import "./Reviews.css";

const Reviews = ({ movieId, reviews = [], onReviewsUpdate }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    score: 5,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (isFormOpen && editingReview) {
      setFormData({
        title: editingReview.title || "",
        description: editingReview.description || "",
        score: editingReview.score || 5,
      });
    } else if (isFormOpen) {
      setFormData({
        title: "",
        description: "",
        score: 5,
      });
    }
    setErrors({});
  }, [isFormOpen, editingReview]);

  // DEBUG: Выводим user и review.user для каждого отзыва
  useEffect(() => {
    if (isAuthenticated && user && reviews.length > 0) {
      console.log("[DEBUG] Текущий пользователь:", user);
      reviews.forEach((review) => {
        console.log(`[DEBUG] Review id=${review.id} user:`, review.user);
      });
    }
  }, [isAuthenticated, user, reviews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "score" ? parseInt(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Заголовок обязателен";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Описание обязательно";
    } else if (formData.description.length < 10) {
      newErrors.description = "Описание должно содержать минимум 10 символов";
    }

    if (formData.score < 1 || formData.score > 10) {
      newErrors.score = "Оценка должна быть от 1 до 10";
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
      if (editingReview) {
        await reviewsAPI.update(editingReview.id, formData);
        showSuccess("Отзыв успешно обновлен");
      } else {
        await reviewsAPI.create(movieId, formData);
        showSuccess("Отзыв успешно добавлен");
      }

      setIsFormOpen(false);
      setEditingReview(null);
      if (onReviewsUpdate) {
        onReviewsUpdate();
      }
    } catch (error) {
      console.error("Error saving review:", error);
      const errorMessage =
        error.response?.data?.message || "Ошибка при сохранении отзыва";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот отзыв?")) {
      return;
    }

    try {
      await reviewsAPI.delete(reviewId);
      showSuccess("Отзыв успешно удален");
      if (onReviewsUpdate) {
        onReviewsUpdate();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      showError("Ошибка при удалении отзыва");
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingReview(null);
    setErrors({});
  };

  // Универсальная проверка "свой отзыв" по user.id и review.userId
  const isMyReview = (review) => {
    if (!isAuthenticated || !user) return false;
    return user.id === review.userId;
  };

  // Найти свой отзыв (если есть)
  const myReview = isAuthenticated ? reviews.find(isMyReview) : null;

  // Проверка ролей
  const userRole = (
    user?.employee?.role ||
    user?.client?.role ||
    ""
  ).toUpperCase();
  const isAdmin = userRole === "ADMIN";
  const isManager = userRole === "MANAGER";

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(
        "[DEBUG] userRole:",
        userRole,
        "isAdmin:",
        isAdmin,
        "isManager:",
        isManager
      );
    }
  }, [isAuthenticated, user, userRole, isAdmin, isManager]);

  // Может ли редактировать отзыв
  const canEditReview = (review) => isMyReview(review);

  // Может ли удалить отзыв
  const canDeleteReview = (review) => {
    if (isAdmin || isManager) return true;
    return isMyReview(review);
  };

  const renderStars = (score) => {
    return "★".repeat(score) + "☆".repeat(10 - score);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Получить аватарку пользователя для отзыва
  const getReviewAvatar = (review) => {
    if (review.user?.avatars && review.user.avatars.length > 0) {
      const last = review.user.avatars[review.user.avatars.length - 1];
      return `http://localhost:3000/${last.path}`;
    }
    return null;
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Отзывы ({reviews.length})</h3>
        {isAuthenticated && !myReview && (
          <button
            className="add-review-btn"
            onClick={() => setIsFormOpen(true)}
            disabled={isFormOpen}
          >
            <span className="btn-icon">+</span>
            Добавить отзыв
          </button>
        )}
      </div>

      {!isAuthenticated && (
        <div className="auth-notice">
          <p>Войдите в систему, чтобы оставить отзыв</p>
        </div>
      )}

      {isFormOpen && (
        <div className="review-form-container">
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-header">
              <h4>{editingReview ? "Редактировать отзыв" : "Новый отзыв"}</h4>
              <button
                type="button"
                className="close-btn"
                onClick={handleCloseForm}
                disabled={loading}
              >
                ✕
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="title">Заголовок *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={errors.title ? "error" : ""}
                placeholder="Краткий заголовок отзыва"
                maxLength={100}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
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
                placeholder="Подробное описание ваших впечатлений"
                rows="4"
                maxLength={1000}
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="score">Оценка *</label>
              <div className="score-input">
                <input
                  type="range"
                  id="score"
                  name="score"
                  min="1"
                  max="10"
                  value={formData.score}
                  onChange={handleInputChange}
                  className={errors.score ? "error" : ""}
                />
                <div className="score-display">
                  <span className="score-value">{formData.score}/10</span>
                  <span className="score-stars">
                    {renderStars(formData.score)}
                  </span>
                </div>
              </div>
              {errors.score && (
                <span className="error-message">{errors.score}</span>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCloseForm}
                disabled={loading}
              >
                Отмена
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading
                  ? "Сохранение..."
                  : editingReview
                    ? "Сохранить"
                    : "Добавить"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <div className="no-reviews-icon">💬</div>
            <p>Пока нет отзывов к этому фильму</p>
            {isAuthenticated && <p>Будьте первым, кто оставит отзыв!</p>}
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="review-author">
                  <div className="author-avatar">
                    {getReviewAvatar(review) ? (
                      <img
                        src={getReviewAvatar(review)}
                        alt="avatar"
                        className="review-avatar-img"
                      />
                    ) : review.user?.name ? (
                      review.user.name.charAt(0).toUpperCase()
                    ) : (
                      review.user?.email?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <div className="author-info">
                    <div className="author-name">
                      {review.user?.client?.name ||
                        review.user?.employee?.name ||
                        review.user?.email?.split("@")[0] ||
                        "Пользователь"}
                    </div>
                    <div className="review-date">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="review-score">
                  <span className="score-stars">
                    {renderStars(review.score)}
                  </span>
                  <span className="score-value">{review.score}/10</span>
                </div>
              </div>

              <div className="review-content">
                <h4 className="review-title">{review.title}</h4>
                <p className="review-description">{review.description}</p>
              </div>

              {(canEditReview(review) || canDeleteReview(review)) && (
                <div className="review-actions">
                  {canEditReview(review) && (
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(review)}
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                  )}
                  {canDeleteReview(review) && (
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(review.id)}
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
