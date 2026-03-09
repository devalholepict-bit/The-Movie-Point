import axios from 'axios';

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL?.replace(/\/+$/, '') || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

if (!TMDB_API_KEY || TMDB_API_KEY === 'your_tmdb_api_key_here') {
  console.error(
    '⚠️ TMDB API key is missing or is still the placeholder.\n' +
    'Open frontend/.env and replace VITE_TMDB_API_KEY= with your real key from https://www.themoviedb.org/settings/api\n' +
    'Then RESTART the Vite dev server (Ctrl+C and npm run dev again).'
  );
}

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_KEY}`
  }
});

export const getPosterUrl = (path, size = 'w500') =>
  path ? `${IMAGE_BASE}/${size}${path}` : '/placeholder-poster.jpg';

export const getBackdropUrl = (path, size = 'original') =>
  path ? `${IMAGE_BASE}/${size}${path}` : '/placeholder-backdrop.jpg';

// Trending
export const getTrending = (mediaType = 'all', timeWindow = 'week', page = 1) =>
  tmdbClient.get(`/trending/${mediaType}/${timeWindow}`, { params: { page } });

// Popular
export const getPopularMovies = (page = 1) =>
  tmdbClient.get('/movie/popular', { params: { page } });

export const getPopularTV = (page = 1) =>
  tmdbClient.get('/tv/popular', { params: { page } });

export const getPopularPeople = (page = 1) =>
  tmdbClient.get('/person/popular', { params: { page } });

// Now Playing / Top Rated / Upcoming
export const getNowPlaying = (page = 1) =>
  tmdbClient.get('/movie/now_playing', { params: { page } });

export const getTopRatedMovies = (page = 1) =>
  tmdbClient.get('/movie/top_rated', { params: { page } });

export const getTopRatedTV = (page = 1) =>
  tmdbClient.get('/tv/top_rated', { params: { page } });

export const getUpcomingMovies = (page = 1) =>
  tmdbClient.get('/movie/upcoming', { params: { page } });

// Discover with genre filter
export const discoverMovies = (page = 1, genreId = null) =>
  tmdbClient.get('/discover/movie', {
    params: { page, sort_by: 'popularity.desc', ...(genreId && { with_genres: genreId }) },
  });

export const discoverTV = (page = 1, genreId = null) =>
  tmdbClient.get('/discover/tv', {
    params: { page, sort_by: 'popularity.desc', ...(genreId && { with_genres: genreId }) },
  });

// Movie Details
export const getMovieDetails = (id) =>
  tmdbClient.get(`/movie/${id}`, { params: { append_to_response: 'credits,videos,similar,recommendations' } });

export const getTVDetails = (id) =>
  tmdbClient.get(`/tv/${id}`, { params: { append_to_response: 'credits,videos,similar,recommendations' } });

export const getPersonDetails = (id) =>
  tmdbClient.get(`/person/${id}`, { params: { append_to_response: 'movie_credits,tv_credits,images' } });

// Videos (trailers)
export const getMovieVideos = (id) => tmdbClient.get(`/movie/${id}/videos`);
export const getTVVideos = (id) => tmdbClient.get(`/tv/${id}/videos`);

// Search
export const searchMulti = (query, page = 1) =>
  tmdbClient.get('/search/multi', { params: { query, page, include_adult: false } });

export const searchMovies = (query, page = 1) =>
  tmdbClient.get('/search/movie', { params: { query, page } });

export const searchTV = (query, page = 1) =>
  tmdbClient.get('/search/tv', { params: { query, page } });

export const searchPeople = (query, page = 1) =>
  tmdbClient.get('/search/person', { params: { query, page } });

// Genres
export const getMovieGenres = () => tmdbClient.get('/genre/movie/list');
export const getTVGenres = () => tmdbClient.get('/genre/tv/list');

export default tmdbClient;
