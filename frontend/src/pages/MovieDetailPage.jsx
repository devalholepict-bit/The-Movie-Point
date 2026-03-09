import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMovieDetails, getTVDetails, getPersonDetails, getPosterUrl, getBackdropUrl, getMovieVideos, getTVVideos } from '../services/tmdbService';
import { addToFavorites, removeFromFavorites } from '../redux/slices/favoritesSlice';
import { addHistory } from '../redux/slices/historySlice';
import { openTrailer } from '../redux/slices/uiSlice';
import MovieCard from '../components/MovieCard/MovieCard';
import { formatDate, formatRating, getRatingColor, getYouTubeKey, truncateText } from '../utils/helpers';
import './MovieDetailPage.css';

const CastCard = ({ member }) => {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="cast-card">
      <div className="cast-photo">
        <img
          src={imgErr || !member.profile_path ? '/placeholder-person.jpg' : getPosterUrl(member.profile_path, 'w185')}
          alt={member.name}
          loading="lazy"
          onError={() => setImgErr(true)}
        />
      </div>
      <div className="cast-info">
        <p className="cast-name">{member.name}</p>
        <p className="cast-role">{member.character || member.job || ''}</p>
      </div>
    </div>
  );
};

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const favorites = useSelector((state) => state.favorites.items);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  const path = window.location.pathname;
  const mediaType = path.startsWith('/tv/') ? 'tv' : path.startsWith('/person/') ? 'person' : 'movie';

  // Auth guard — redirect guests immediately
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true, state: { from: path, message: '🔒 Please log in to view movie details and watch trailers.' } });
    }
  }, [user, navigate, path]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        if (mediaType === 'tv') res = await getTVDetails(id);
        else if (mediaType === 'person') res = await getPersonDetails(id);
        else res = await getMovieDetails(id);
        setData(res.data);

        // Save to watch history if user is logged in
        if (user) {
          const title = res.data.title || res.data.name || '';
          const poster = res.data.poster_path ? getPosterUrl(res.data.poster_path, 'w342') : '';
          dispatch(addHistory({ movieId: String(id), title, poster, mediaType }));
        }
      } catch (e) {
        setError('Failed to load details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo({ top: 0 });
  }, [id, mediaType, user]);

  const handleTrailer = async () => {
    try {
      let res;
      if (mediaType === 'tv') res = await getTVVideos(id);
      else res = await getMovieVideos(id);
      const key = getYouTubeKey(res.data);
      dispatch(openTrailer(key));
      // Track trailer view as history
      if (user && data) {
        const title = data.title || data.name || '';
        const poster = data.poster_path ? getPosterUrl(data.poster_path, 'w342') : '';
        dispatch(addHistory({ movieId: String(id), title, poster, mediaType }));
      }
    } catch {
      dispatch(openTrailer(null));
    }
  };

  const isFav = favorites.some((f) => f.movieId === String(id));

  const handleFavToggle = () => {
    if (!user) { navigate('/login'); return; }
    if (isFav) {
      dispatch(removeFromFavorites(String(id)));
    } else if (data) {
      dispatch(addToFavorites({
        movieId: String(id),
        title: data.title || data.name || '',
        poster: data.poster_path ? getPosterUrl(data.poster_path, 'w342') : '',
        rating: data.vote_average || 0,
        releaseDate: data.release_date || data.first_air_date || '',
        mediaType,
      }));
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="detail-skeleton">
          <div className="detail-skeleton-backdrop shimmer" />
          <div className="container">
            <div className="detail-skeleton-info">
              <div className="shimmer" style={{ width: 200, height: 300, borderRadius: 12 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="shimmer skeleton-line" style={{ width: '60%', height: 32 }} />
                <div className="shimmer skeleton-line" style={{ width: '40%', height: 16 }} />
                <div className="shimmer skeleton-line" style={{ width: '90%', height: 100 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-content">
        <div className="empty-state container">
          <div className="empty-icon">😞</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error || 'No data available'}</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  // Person page
  if (mediaType === 'person') {
    const knownMovies = [...(data.movie_credits?.cast || []), ...(data.tv_credits?.cast || [])]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 12);
    return (
      <div className="page-content detail-page">
        <div className="person-detail container">
          <div className="person-detail-header">
            <div className="person-detail-photo">
              <img
                src={data.profile_path ? getPosterUrl(data.profile_path, 'w342') : '/placeholder-person.jpg'}
                alt={data.name}
                onError={(e) => { e.target.src = '/placeholder-person.jpg'; }}
              />
            </div>
            <div className="person-detail-info">
              <h1 className="detail-title">{data.name}</h1>
              <div className="detail-meta">
                {data.known_for_department && <span className="meta-chip">{data.known_for_department}</span>}
                {data.birthday && <span className="meta-chip">🎂 {formatDate(data.birthday)}</span>}
                {data.place_of_birth && <span className="meta-chip">📍 {data.place_of_birth}</span>}
              </div>
              <p className="detail-overview">{data.biography || 'Biography not available.'}</p>
            </div>
          </div>
          {knownMovies.length > 0 && (
            <section style={{ marginTop: 48 }}>
              <h2 className="section-title">Known For</h2>
              <div className="movies-grid">
                {knownMovies.map((m) => <MovieCard key={`${m.id}-${m.media_type}`} item={m} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // Movie/TV page
  const title = data.title || data.name || 'Unknown Title';
  const overview = data.overview || 'Description not available.';
  const releaseDate = data.release_date || data.first_air_date || '';
  const rating = data.vote_average || 0;
  const genres = data.genres || [];
  const cast = data.credits?.cast?.slice(0, 12) || [];
  const similar = (data.similar?.results || data.recommendations?.results || []).slice(0, 8);
  const posterUrl = imgError ? '/placeholder.jpg' : getPosterUrl(data.poster_path, 'w500');
  const backdropUrl = getBackdropUrl(data.backdrop_path);

  return (
    <div className="detail-page">
      {/* Backdrop */}
      <div className="detail-backdrop" style={{ '--backdrop': `url(${backdropUrl})` }}>
        <div className="detail-backdrop-overlay" />
      </div>

      <div className="detail-content container">
        {/* Header */}
        <div className="detail-header">
          <div className="detail-poster">
            <img src={posterUrl} alt={title} onError={() => setImgError(true)} />
          </div>
          <div className="detail-meta-panel">
            <h1 className="detail-title">{title}</h1>

            <div className="detail-meta">
              {releaseDate && <span className="meta-chip">📅 {formatDate(releaseDate)}</span>}
              {rating > 0 && (
                <span className="meta-chip rating-chip" style={{ color: getRatingColor(rating) }}>
                  ⭐ {formatRating(rating)} / 10
                </span>
              )}
              {data.runtime && <span className="meta-chip">⏱ {data.runtime} min</span>}
              {data.number_of_seasons && <span className="meta-chip">📺 {data.number_of_seasons} Seasons</span>}
            </div>

            {genres.length > 0 && (
              <div className="detail-genres">
                {genres.map((g) => <span key={g.id} className="genre-tag">{g.name}</span>)}
              </div>
            )}

            <p className="detail-overview">{overview}</p>

            <div className="detail-actions">
              <button className="btn btn-primary detail-btn" onClick={user ? handleTrailer : () => navigate('/login', { state: { from: path, message: '🔒 Login to watch trailers.' } })}>
                {user ? '▶ Watch Trailer' : '🔒 Login to Watch Trailer'}
              </button>
              <button
                className={`btn detail-btn ${isFav ? 'btn-primary' : 'btn-outline'}`}
                onClick={handleFavToggle}
              >
                {isFav ? '❤️ Favorited' : user ? '🤍 Add to Favorites' : '🔒 Login to Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <section className="detail-section">
            <h2 className="section-title">🎭 Cast</h2>
            <div className="cast-scroll">
              {cast.map((member) => <CastCard key={member.id} member={member} />)}
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section className="detail-section">
            <h2 className="section-title">🎬 More Like This</h2>
            <div className="movies-grid">
              {similar.map((item) => (
                <MovieCard key={item.id} item={{ ...item, media_type: mediaType }} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
