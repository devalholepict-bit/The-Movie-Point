import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiscoverTV, resetDiscoverTV } from '../redux/slices/moviesSlice';
import MovieCard from '../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../components/SkeletonCard/SkeletonCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import './MoviesPage.css';

const TVShowsPage = () => {
  const dispatch = useDispatch();
  const { discoverTV, discoverTvPage, discoverTvTotalPages, loading } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(resetDiscoverTV());
    dispatch(fetchDiscoverTV({ page: 1, genreId: null }));
  }, [dispatch]);

  const hasMore = discoverTvPage < discoverTvTotalPages;

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchDiscoverTV({ page: discoverTvPage + 1, genreId: null }));
    }
  }, [dispatch, loading, hasMore, discoverTvPage]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

  return (
    <div className="page-content movies-page">
      <div className="container">
        <h1 className="page-heading">📺 TV Shows</h1>
        {discoverTV.length === 0 && loading ? (
          <SkeletonGrid count={20} />
        ) : (
          <>
            <div className="movies-grid">
              {discoverTV.map((show) => (
                <MovieCard key={show.id} item={{ ...show, media_type: 'tv' }} />
              ))}
            </div>
            <div ref={sentinelRef} style={{ height: 40 }} />
            {loading && <div className="load-more-spinner"><div className="spinner" /></div>}
            {!hasMore && discoverTV.length > 0 && (
              <div className="end-message">✓ All TV shows loaded!</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TVShowsPage;
