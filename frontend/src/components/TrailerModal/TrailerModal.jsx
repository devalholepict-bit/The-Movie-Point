import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeTrailer } from '../../redux/slices/uiSlice';
import './TrailerModal.css';

const TrailerModal = () => {
  const dispatch = useDispatch();
  const { trailerOpen, trailerId } = useSelector((state) => state.ui);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') dispatch(closeTrailer());
    };
    if (trailerOpen) {
      window.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [trailerOpen, dispatch]);

  if (!trailerOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) dispatch(closeTrailer());
  };

  return (
    <div className="trailer-overlay" onClick={handleOverlayClick}>
      <div className="trailer-modal">
        <button className="trailer-close-btn" onClick={() => dispatch(closeTrailer())}>
          ✕
        </button>
        {trailerId ? (
          <div className="trailer-video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="trailer-unavailable">
            <div className="trailer-unavailable-icon">🎬</div>
            <h3>Trailer Unavailable</h3>
            <p>Trailer for this title is currently unavailable.</p>
            <button className="btn btn-outline" onClick={() => dispatch(closeTrailer())}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrailerModal;
