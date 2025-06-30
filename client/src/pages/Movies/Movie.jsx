import React, { useState, useEffect } from "react";
import { moviesAPI } from "../../api/movies.js";
import { useNotification } from "../../hooks/useNotification.js";
import { useAuth } from "../../hooks/useAuth.js";
import MovieCard from "../../components/MovieCard/MovieCard.jsx";
import MovieModal from "./components/MovieModal.jsx";
import "./Movie.css";

const Movie = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const { showError, showSuccess } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await moviesAPI.getAll();
      setMovies(data);

      // Извлекаем уникальные жанры из всех фильмов
      const allGenres = data.reduce((acc, movie) => {
        if (movie.genres) {
          movie.genres.forEach((genre) => {
            if (!acc.find((g) => g.id === genre.id)) {
              acc.push(genre);
            }
          });
        }
        return acc;
      }, []);
      setGenres(allGenres);
    } catch (error) {
      console.error("Error fetching movies:", error);
      showError("Ошибка при загрузке фильмов");
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация фильмов
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre =
      !selectedGenre ||
      (movie.genres &&
        movie.genres.some((genre) => genre.id === selectedGenre));

    return matchesSearch && matchesGenre;
  });

  const handleCreateMovie = () => {
    setEditingMovie(null);
    setIsModalOpen(true);
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setIsModalOpen(true);
  };

  const handleSaveMovie = async (movieData, files) => {
    try {
      if (editingMovie) {
        // Обновление существующего фильма
        await moviesAPI.update(editingMovie.id, movieData);
        showSuccess("Фильм успешно обновлен");
      } else {
        // Создание нового фильма
        const newMovie = await moviesAPI.create(movieData);

        // Если есть файлы, добавляем их
        if (files && files.length > 0) {
          await moviesAPI.addImages(newMovie.id, files);
        }

        showSuccess("Фильм успешно создан");
      }

      // Обновляем список фильмов
      await fetchMovies();
    } catch (error) {
      console.error("Error saving movie:", error);
      const errorMessage =
        error.response?.data?.message || "Ошибка при сохранении фильма";
      showError(errorMessage);
      throw error; // Пробрасываем ошибку, чтобы модальное окно не закрылось
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMovie(null);
  };

  // Проверяем права доступа
  const canCreate =
    user?.client?.role === "Admin" ||
    user?.employee?.role === "Admin" ||
    user?.employee?.role === "Manager";
  const canEdit = canCreate;

  if (loading) {
    return (
      <div className="movies-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка фильмов...</p>
      </div>
    );
  }

  return (
    <div className="movies-container">
      <div className="movies-header">
        <div className="movies-title-section">
          <h1>Фильмы</h1>
          <p>Откройте для себя удивительный мир кино</p>
        </div>

        {canCreate && (
          <button className="create-movie-btn" onClick={handleCreateMovie}>
            <span className="btn-icon">+</span>
            Добавить фильм
          </button>
        )}
      </div>

      <div className="movies-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск фильмов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="genre-filter"
        >
          <option value="">Все жанры</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="no-movies">
          <div className="no-movies-icon">🎬</div>
          <h3>Фильмы не найдены</h3>
          <p>
            {searchTerm || selectedGenre
              ? "Попробуйте изменить параметры поиска"
              : "В данный момент фильмы не добавлены"}
          </p>
        </div>
      ) : (
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onEdit={canEdit ? handleEditMovie : null}
            />
          ))}
        </div>
      )}

      <MovieModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveMovie}
        movie={editingMovie}
        isEditing={!!editingMovie}
      />
    </div>
  );
};

export default Movie;
