export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const formatRating = (rating) => {
  if (rating == null || isNaN(rating)) return '0.0';
  return Number(rating).toFixed(1);
};

export const getRatingColor = (rating) => {
  if (rating >= 8) return '#4caf50';
  if (rating >= 6) return '#ff9800';
  if (rating >= 4) return '#f44336';
  return '#9e9e9e';
};

export const getYouTubeKey = (videos) => {
  if (!videos || !videos.results || videos.results.length === 0) return null;
  const official = videos.results.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
  );
  const trailer = videos.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const teaser = videos.results.find((v) => v.site === 'YouTube' && v.type === 'Teaser');
  const any = videos.results.find((v) => v.site === 'YouTube');
  return (official || trailer || teaser || any)?.key || null;
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return 'Description not available.';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const getMediaType = (item) => {
  if (item.media_type) return item.media_type;
  if (item.first_air_date !== undefined) return 'tv';
  if (item.release_date !== undefined) return 'movie';
  return 'movie';
};

export const getTitle = (item) => item.title || item.name || 'Unknown Title';

export const getReleaseDate = (item) => item.release_date || item.first_air_date || '';
