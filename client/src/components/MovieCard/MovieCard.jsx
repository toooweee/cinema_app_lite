import React from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";

const MovieCard = ({ movie, onEdit }) => {
  const { id, name, description, rating, images, genres, link } = movie;

  // Получаем первое изображение или используем заглушку
  const imageUrl =
    images && images.length > 0
      ? `http://localhost:3000/${images[0].path}`
      : "/placeholder-movie.jpg";

  // Обрезаем описание для карточки
  const shortDescription =
    description?.length > 100
      ? `${description.substring(0, 100)}...`
      : description;

  // Форматируем рейтинг
  const formattedRating = rating ? rating.toFixed(1) : "0.0";

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(movie);
    }
  };

  return (
    <div className="movie-card">
      <div className="movie-card-image">
        <img
          src={imageUrl}
          alt={name}
          onError={(e) => {
            e.target.src = "/placeholder-movie.jpg";
          }}
        />
        <div className="movie-card-overlay">
          <div className="movie-card-actions">
            <Link to={`/movies/${id}`} className="movie-card-button">
              Подробнее
            </Link>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="movie-card-button secondary"
              >
                Смотреть
              </a>
            )}
            {onEdit && (
              <button
                onClick={handleEditClick}
                className="movie-card-button edit"
                title="Редактировать"
              >
                ✏️
              </button>
            )}
          </div>
        </div>
        <div className="movie-card-rating">
          <span className="rating-star">★</span>
          <span className="rating-value">{formattedRating}</span>
        </div>
      </div>

      <div className="movie-card-content">
        <h3 className="movie-card-title">{name}</h3>

        {genres && genres.length > 0 && (
          <div className="movie-card-genres">
            {genres.slice(0, 3).map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
            {genres.length > 3 && (
              <span className="genre-tag more">+{genres.length - 3}</span>
            )}
          </div>
        )}

        {shortDescription && (
          <p className="movie-card-description">{shortDescription}</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
