import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchDiscoverMovies, resetDiscover } from '../redux/slices/moviesSlice';
import MovieCard from '../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../components/SkeletonCard/SkeletonCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import './MoviesPage.css';

const GENRES = [
  { id: null, name: 'All' }, { id: 28, name: 'Action' }, { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' }, { id: 27, name: 'Horror' }, { id: 878, name: 'Sci-Fi' },
  { id: 10749, name: 'Romance' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
  { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' }, { id: 14, name: 'Fantasy' },
];

const MoviesPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { discoverMovies, discoverPage, discoverTotalPages, loading } = useSelector((state) => state.movies);
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') ? Number(searchParams.get('genre')) : null);
  const [nextPage, setNextPage] = useState(1);

  useEffect(() => {
    dispatch(resetDiscover());
    setNextPage(1);
    dispatch(fetchDiscoverMovies({ page: 1, genreId: selectedGenre }));
  }, [dispatch, selectedGenre]);

  const hasMore = discoverPage < discoverTotalPages;

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const next = discoverPage + 1;
      setNextPage(next);
      dispatch(fetchDiscoverMovies({ page: next, genreId: selectedGenre }));
    }
  }, [dispatch, loading, hasMore, discoverPage, selectedGenre]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    if (genreId) setSearchParams({ genre: genreId });
    else setSearchParams({});
  };

  return (
    <div className="page-content movies-page">
      <div className="container">
        <h1 className="page-heading">🎬 Movies</h1>

        {/* Genre Filter */}
        <div className="genre-filter">
          {GENRES.map((g) => (
            <button
              key={g.id ?? 'all'}
              className={`genre-chip ${selectedGenre === g.id ? 'active' : ''}`}
              onClick={() => handleGenreSelect(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Movies Grid */}
        {discoverMovies.length === 0 && loading ? (
          <SkeletonGrid count={20} />
        ) : (
          <>
            <div className="movies-grid">
              {discoverMovies.map((movie) => (
                <MovieCard key={movie.id} item={movie} />
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} style={{ height: 40 }} />

            {loading && (
              <div className="load-more-spinner">
                <div className="spinner" />
              </div>
            )}

            {!hasMore && discoverMovies.length > 0 && (
              <div className="end-message">✓ You've seen all the movies!</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
