import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../../redux/slices/favoritesSlice';
import { getPosterUrl } from '../../services/tmdbService';
import { formatDate, formatRating, getRatingColor, getTitle, getReleaseDate, getMediaType } from '../../utils/helpers';
import './MovieCard.css';

const MovieCard = ({ item, onWatchTrailer }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const favorites = useSelector((state) => state.favorites.items);
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  const mediaType = getMediaType(item);
  const title = getTitle(item);
  const rating = item.vote_average || 0;
  const releaseDate = getReleaseDate(item);
  const poster = imgError ? '/placeholder.jpg' : getPosterUrl(item.poster_path, 'w342');
  const isFavorited = favorites.some((f) => f.movieId === String(item.id));

  const detailPath = mediaType === 'tv' ? `/tv/${item.id}` : mediaType === 'person' ? `/person/${item.id}` : `/movie/${item.id}`;

  const handleCardClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login', { state: { from: detailPath, message: 'Please log in to view movie details.' } });
    }
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { from: detailPath, message: 'Please log in to manage your favorites.' } });
      return;
    }
    if (isFavorited) {
      dispatch(removeFromFavorites(String(item.id)));
    } else {
      dispatch(addToFavorites({
        movieId: String(item.id),
        title,
        poster: getPosterUrl(item.poster_path, 'w342'),
        rating,
        releaseDate,
        mediaType,
      }));
    }
  };

  return (
    <Link to={detailPath} className="movie-card" onClick={handleCardClick}>
      <div className="movie-card-poster">
        <img
          src={poster}
          alt={title}
          loading="lazy"
          onError={() => setImgError(true)}
        />

        {/* Guest lock overlay */}
        {!user && (
          <div className="card-lock-overlay">
            <div className="card-lock-content">
              <span className="card-lock-icon">🔒</span>
              <span className="card-lock-text">Login to Watch</span>
            </div>
          </div>
        )}

        {/* Hover overlay (for logged-in users) */}
        {user && (
          <div className="movie-card-overlay">
            <div className="overlay-actions">
              <button
                className={`fav-btn ${isFavorited ? 'active' : ''}`}
                onClick={handleFavoriteToggle}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorited ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        )}

        {/* Rating Badge */}
        {rating > 0 && (
          <div className="rating-badge" style={{ color: getRatingColor(rating) }}>
            <span>⭐</span>
            <span>{formatRating(rating)}</span>
          </div>
        )}

        {/* Media type badge */}
        <div className={`type-badge ${mediaType}`}>
          {mediaType === 'tv' ? 'TV' : mediaType === 'person' ? 'Person' : 'Movie'}
        </div>
      </div>

      <div className="movie-card-info">
        <h3 className="movie-card-title">{title}</h3>
        {releaseDate && (
          <p className="movie-card-date">{formatDate(releaseDate)}</p>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
