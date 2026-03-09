import React, { useEffect, useState, useCallback } from 'react';
import { getPopularPeople, getPosterUrl } from '../services/tmdbService';
import { Link } from 'react-router-dom';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import './MoviesPage.css';
import './PeoplePage.css';

const PeoplePage = () => {
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPeople = useCallback(async (pg) => {
    setLoading(true);
    try {
      const res = await getPopularPeople(pg);
      const data = res.data;
      setPeople((prev) => pg === 1 ? data.results : [...prev, ...data.results]);
      setTotalPages(data.total_pages);
      setPage(pg);
    } catch (e) { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPeople(1); }, [fetchPeople]);

  const hasMore = page < totalPages;
  const loadMore = useCallback(() => {
    if (!loading && hasMore) fetchPeople(page + 1);
  }, [loading, hasMore, page, fetchPeople]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

  return (
    <div className="page-content movies-page">
      <div className="container">
        <h1 className="page-heading">👥 Popular People</h1>
        <div className="people-grid">
          {people.map((person) => (
            <Link to={`/person/${person.id}`} key={person.id} className="person-card">
              <div className="person-avatar">
                <img
                  src={person.profile_path ? getPosterUrl(person.profile_path, 'w342') : '/placeholder-person.jpg'}
                  alt={person.name}
                  loading="lazy"
                  onError={(e) => { e.target.src = '/placeholder-person.jpg'; }}
                />
              </div>
              <div className="person-info">
                <h3 className="person-name">{person.name}</h3>
                <p className="person-known">{person.known_for_department || 'Acting'}</p>
                <p className="person-known-works">
                  {person.known_for?.slice(0, 2).map(m => m.title || m.name).join(', ')}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div ref={sentinelRef} style={{ height: 40 }} />
        {loading && <div className="load-more-spinner"><div className="spinner" /></div>}
      </div>
    </div>
  );
};

export default PeoplePage;
