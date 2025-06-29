import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { moviesAPI } from "../../api/movies.js";
import { useNotification } from "../../hooks/useNotification.js";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { showError } = useNotification();

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const data = await moviesAPI.getById(id);
      setMovie(data);
    } catch (error) {
      console.error("Error fetching movie:", error);
      showError("Ошибка при загрузке фильма");
      navigate("/movies");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (index) => {
    setActiveImageIndex(index);
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : "0.0";
  };

  if (loading) {
    return (
      <div className="movie-detail-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка фильма...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-detail-error">
        <h2>Фильм не найден</h2>
        <Link to="/movies" className="back-button">
          Вернуться к фильмам
        </Link>
      </div>
    );
  }

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-background">
        {movie.images && movie.images.length > 0 && (
          <div
            className="background-image"
            style={{
              backgroundImage: `url(http://localhost:3000/${movie.images[activeImageIndex]?.path})`,
            }}
          />
        )}
        <div className="background-overlay"></div>
      </div>

      <div className="movie-detail-content">
        <div className="movie-detail-header">
          <Link to="/movies" className="back-link">
            ← Назад к фильмам
          </Link>

          <div className="movie-detail-rating">
            <span className="rating-star">★</span>
            <span className="rating-value">{formatRating(movie.rating)}</span>
          </div>
        </div>

        <div className="movie-detail-main">
          <div className="movie-detail-images">
            {movie.images && movie.images.length > 0 ? (
              <>
                <div className="main-image">
                  <img
                    src={`http://localhost:3000/${movie.images[activeImageIndex]?.path}`}
                    alt={movie.name}
                    onError={(e) => {
                      e.target.src = "/placeholder-movie.jpg";
                    }}
                  />
                </div>

                {movie.images.length > 1 && (
                  <div className="image-thumbnails">
                    {movie.images.map((image, index) => (
                      <div
                        key={index}
                        className={`thumbnail ${index === activeImageIndex ? "active" : ""}`}
                        onClick={() => handleImageClick(index)}
                      >
                        <img
                          src={`http://localhost:3000/${image.path}`}
                          alt={`${movie.name} ${index + 1}`}
                          onError={(e) => {
                            e.target.src = "/placeholder-movie.jpg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="main-image placeholder">
                <img src="/placeholder-movie.jpg" alt={movie.name} />
              </div>
            )}
          </div>

          <div className="movie-detail-info">
            <h1 className="movie-title">{movie.name}</h1>

            {movie.genres && movie.genres.length > 0 && (
              <div className="movie-genres">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {movie.description && (
              <div className="movie-description">
                <h3>Описание</h3>
                <p>{movie.description}</p>
              </div>
            )}

            {movie.link && (
              <div className="movie-actions">
                <a
                  href={movie.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="watch-button"
                >
                  🎬 Смотреть фильм
                </a>
              </div>
            )}

            {movie.reviews && movie.reviews.length > 0 && (
              <div className="movie-reviews">
                <h3>Отзывы ({movie.reviews.length})</h3>
                <div className="reviews-list">
                  {movie.reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <span className="review-author">
                          {review.user?.name || "Аноним"}
                        </span>
                        <span className="review-rating">
                          {"★".repeat(Math.floor(review.rating || 0))}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
                {movie.reviews.length > 3 && (
                  <p className="more-reviews">
                    И еще {movie.reviews.length - 3} отзывов...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
