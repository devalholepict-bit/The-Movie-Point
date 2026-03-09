import React from 'react';
import './SkeletonCard.css';

const SkeletonCard = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="skeleton-poster shimmer" />
    <div className="skeleton-info">
      <div className="skeleton-line wide shimmer" />
      <div className="skeleton-line short shimmer" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 20 }) => (
  <div className="movies-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
