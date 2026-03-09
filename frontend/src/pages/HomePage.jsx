import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTrending, fetchPopularMovies } from '../redux/slices/moviesSlice';
import { getPopularTV, getNowPlaying, getBackdropUrl, getPosterUrl, getMovieVideos, getTVVideos } from '../services/tmdbService';
import { openTrailer } from '../redux/slices/uiSlice';
import MovieCard from '../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../components/SkeletonCard/SkeletonCard';
import { getTitle, getReleaseDate, getYouTubeKey, truncateText, formatRating } from '../utils/helpers';
import './HomePage.css';

const GENRES = [
  { id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' }, { id: 878, name: 'Sci-Fi' }, { id: 10749, name: 'Romance' },
  { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
];

const HeroBanner = ({ item, onPlayTrailer }) => {
  const [imgError, setImgError] = useState(false);
  if (!item) return null;
  const title = getTitle(item);
  const mediaType = item.media_type || 'movie';
  const detailPath = mediaType === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
  const backdrop = imgError
    ? null
    : getBackdropUrl(item.backdrop_path, 'original');

  return (
    <div className="hero-banner" style={backdrop ? { '--backdrop': `url(${backdrop})` } : {}}>
      <div className="hero-bg" />
      <div className="hero-content container">
        <div className="hero-info">
          <div className="hero-badges">
            <span className="badge">{mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
            {item.vote_average > 0 && (
              <span className="hero-rating">⭐ {formatRating(item.vote_average)}</span>
            )}
          </div>
          <h1 className="hero-title">{title}</h1>
          <p className="hero-overview">{truncateText(item.overview, 200)}</p>
          <div className="hero-actions">
            <button className="btn btn-primary hero-btn" onClick={onPlayTrailer}>
              ▶ Play Trailer
            </button>
            <Link to={detailPath} className="btn btn-outline hero-btn">
              ℹ More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { trending, trendingLoading, popular, loading, error } = useSelector((state) => state.movies);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [popularTV, setPopularTV] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [tvLoading, setTvLoading] = useState(false);
  const [extraError, setExtraError] = useState(null);

  useEffect(() => {
    dispatch(fetchTrending());
    dispatch(fetchPopularMovies(1));
    const fetchExtra = async () => {
      setTvLoading(true);
      setExtraError(null);
      try {
        const [tvRes, npRes] = await Promise.all([getPopularTV(1), getNowPlaying(1)]);
        if (tvRes?.data?.results) setPopularTV(tvRes.data.results.slice(0, 10));
        if (npRes?.data?.results) setNowPlaying(npRes.data.results.slice(0, 10));
      } catch (e) {
        setExtraError(e.response?.data?.status_message || e.message);
      } finally {
        setTvLoading(false);
      }
    };
    fetchExtra();
  }, [dispatch]);

  // Auto-rotate hero banner
  useEffect(() => {
    if (trending.length === 0) return;
    const timer = setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % Math.min(5, trending.length));
    }, 7000);
    return () => clearInterval(timer);
  }, [trending]);

  const featuredItem = trending[featuredIndex];

  const handleHeroTrailer = async () => {
    if (!featuredItem) return;
    if (!user) {
      // Redirect guest to login
      window.location.href = '/login';
      return;
    }
    try {
      const mediaType = featuredItem.media_type || 'movie';
      const res = mediaType === 'tv'
        ? await getTVVideos(featuredItem.id)
        : await getMovieVideos(featuredItem.id);
      const key = getYouTubeKey(res.data);
      dispatch(openTrailer(key));
    } catch {
      dispatch(openTrailer(null));
    }
  };

  const Section = ({ title, items = [], isLoading, errorMsg }) => (
    <section className="home-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <Link to="/movies" className="see-all-link">See All →</Link>
        </div>
        {errorMsg ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>Failed to load {title.replace(/[^a-zA-Z\s]/g, '')}</h3>
            <p className="error-text" style={{ color: 'var(--accent)' }}>{errorMsg}</p>
          </div>
        ) : isLoading ? (
          <SkeletonGrid count={10} />
        ) : items?.length > 0 ? (
          <div className="movies-grid">
            {items?.slice(0, 10).map((item) => (
              <MovieCard key={item?.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h3>No movies found</h3>
          </div>
        )}
      </div>
    </section>
  );

  if (trendingLoading && !featuredItem) {
    return (
      <div className="home-page" style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <SkeletonGrid count={10} />
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Banner */}
      {error ? (
        <div className="hero-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: 16 }}>⚠️ API Error</h2>
          <p>{error}</p>
        </div>
      ) : trendingLoading || !featuredItem ? (
        <div className="hero-skeleton shimmer" />
      ) : (
        <HeroBanner item={featuredItem} onPlayTrailer={handleHeroTrailer} />
      )}

      {/* Hero dots */}
      {trending.length > 0 && (
        <div className="hero-dots container">
          {Array.from({ length: Math.min(5, trending.length) }).map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === featuredIndex ? 'active' : ''}`}
              onClick={() => setFeaturedIndex(i)}
            />
          ))}
        </div>
      )}

      {/* Genre Filter */}
      <section className="genre-section">
        <div className="container">
          <div className="genre-chips">
            {GENRES.map((g) => (
              <Link key={g.id} to={`/movies?genre=${g.id}`} className="genre-chip">
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <Section title="🔥 Trending This Week" items={trending} isLoading={trendingLoading} errorMsg={error} />

      {/* Now Playing */}
      <Section title="🎭 Now Playing" items={nowPlaying} isLoading={tvLoading} errorMsg={extraError} />

      {/* Popular Movies */}
      <Section title="🎬 Popular Movies" items={popular} isLoading={loading} errorMsg={error} />

      {/* Popular TV */}
      <Section title="📺 Popular TV Shows" items={popularTV} isLoading={tvLoading} errorMsg={extraError} />
    </div>
  );
};

export default HomePage;
