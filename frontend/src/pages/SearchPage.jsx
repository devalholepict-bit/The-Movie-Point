import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMulti } from '../services/tmdbService';
import MovieCard from '../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../components/SkeletonCard/SkeletonCard';
import useDebounce from '../hooks/useDebounce';
import './SearchPage.css';

const FILTER_OPTIONS = ['all', 'movie', 'tv', 'person'];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await searchMulti(debouncedQuery, 1);
        setResults(res.data.results);
        setTotalPages(res.data.total_pages);
        setPage(1);
      } catch { /* ignore */ } finally { setLoading(false); }
    };
    fetchResults();
    setSearchParams({ q: debouncedQuery });
  }, [debouncedQuery]);

  const loadMore = async () => {
    if (page >= totalPages || loading) return;
    setLoading(true);
    try {
      const res = await searchMulti(debouncedQuery, page + 1);
      setResults((prev) => [...prev, ...res.data.results]);
      setPage((p) => p + 1);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  const filtered = filter === 'all' ? results : results.filter((r) => r.media_type === filter);

  return (
    <div className="page-content search-page">
      <div className="container">
        <h1 className="page-heading">🔍 Search</h1>

        {/* Search Input */}
        <div className="search-hero">
          <input
            type="text"
            className="search-hero-input"
            placeholder="Search movies, TV shows, actors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Filter Tabs */}
        <div className="search-filters">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'tv' ? 'TV Shows' : f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'all' && results.length > 0 && ` (${results.length})`}
            </button>
          ))}
        </div>

        {/* Results */}
        {!debouncedQuery.trim() ? (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h3>Search for anything</h3>
            <p>Movies, TV shows, actors, directors — find them all here</p>
          </div>
        ) : loading && results.length === 0 ? (
          <SkeletonGrid count={20} />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">😕</div>
            <h3>No results found</h3>
            <p>Try a different search term or filter</p>
          </div>
        ) : (
          <>
            <div className="search-results-header">
              <p className="results-count">{filtered.length} results for "{debouncedQuery}"</p>
            </div>
            <div className="movies-grid">
              {filtered.map((item) => (
                <MovieCard key={`${item.id}-${item.media_type}`} item={item} />
              ))}
            </div>
            {page < totalPages && (
              <div style={{ textAlign: 'center', padding: '32px' }}>
                <button className="btn btn-outline" onClick={loadMore} disabled={loading}>
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
