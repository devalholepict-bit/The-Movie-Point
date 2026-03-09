import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchFavorites, removeFromFavorites } from '../redux/slices/favoritesSlice';
import { formatDate, formatRating } from '../utils/helpers';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { items: favorites, loading } = useSelector((state) => state.favorites);

  useEffect(() => { dispatch(fetchFavorites()); }, [dispatch]);

  const handleRemove = (movieId) => { dispatch(removeFromFavorites(movieId)); };

  const detailPath = (item) =>
    item.mediaType === 'tv' ? `/tv/${item.movieId}` : item.mediaType === 'person' ? `/person/${item.movieId}` : `/movie/${item.movieId}`;

  if (loading) {
    return <div className="page-content"><div className="spinner-wrapper"><div className="spinner" /></div></div>;
  }

  return (
    <div className="page-content">
      <div className="container">
        <h1 className="page-heading">❤️ My Favorites</h1>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💔</div>
            <h3>No favorites yet</h3>
            <p>Start adding movies and shows you love!</p>
            <Link to="/movies" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Movies</Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((item) => (
              <div key={item._id} className="fav-item">
                <Link to={detailPath(item)} className="fav-poster-link">
                  <img
                    src={item.poster || '/placeholder.jpg'}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />
                  <div className="fav-overlay">
                    <span className="fav-play-btn">▶</span>
                  </div>
                </Link>
                <div className="fav-info">
                  <Link to={detailPath(item)} className="fav-title">{item.title}</Link>
                  <div className="fav-meta">
                    {item.releaseDate && <span>{formatDate(item.releaseDate)}</span>}
                    {item.rating > 0 && <span>⭐ {formatRating(item.rating)}</span>}
                    <span className={`type-badge ${item.mediaType || 'movie'}`}>
                      {item.mediaType === 'tv' ? 'TV' : 'Movie'}
                    </span>
                  </div>
                  <button
                    className="btn btn-outline fav-remove-btn"
                    onClick={() => handleRemove(item.movieId)}
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
