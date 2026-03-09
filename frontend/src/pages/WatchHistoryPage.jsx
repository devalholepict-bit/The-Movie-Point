import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchHistory, clearWatchHistory } from '../redux/slices/historySlice';
import { formatDate } from '../utils/helpers';
import './FavoritesPage.css';
import './WatchHistoryPage.css';

const WatchHistoryPage = () => {
  const dispatch = useDispatch();
  const { items: history, loading } = useSelector((state) => state.history);

  useEffect(() => { dispatch(fetchHistory()); }, [dispatch]);

  const handleClear = () => { if (window.confirm('Clear all watch history?')) dispatch(clearWatchHistory()); };

  const detailPath = (item) =>
    item.mediaType === 'tv' ? `/tv/${item.movieId}` : `/movie/${item.movieId}`;

  if (loading) {
    return <div className="page-content"><div className="spinner-wrapper"><div className="spinner" /></div></div>;
  }

  return (
    <div className="page-content">
      <div className="container">
        <div className="history-header">
          <h1 className="page-heading">🕐 Watch History</h1>
          {history.length > 0 && (
            <button className="btn btn-outline" onClick={handleClear} style={{ color: 'var(--accent)' }}>
              🗑 Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📺</div>
            <h3>No watch history yet</h3>
            <p>Movies and shows you open will appear here</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Explore Now</Link>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <Link key={item._id} to={detailPath(item)} className="history-item">
                <div className="history-poster">
                  <img
                    src={item.poster || '/placeholder.jpg'}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />
                </div>
                <div className="history-info">
                  <h3 className="history-title">{item.title}</h3>
                  <div className="history-meta">
                    <span className={`type-badge ${item.mediaType || 'movie'}`}>{item.mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
                    <span className="history-date">Watched {formatDate(item.watchedAt)}</span>
                  </div>
                </div>
                <div className="history-arrow">→</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchHistoryPage;
