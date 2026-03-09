import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => apiClient.post('/register', data);
export const loginUser = (data) => apiClient.post('/login', data);
export const getMe = () => apiClient.get('/me');

// Movies (admin)
export const fetchAdminMovies = (params) => apiClient.get('/movies', { params });
export const createAdminMovie = (data) => apiClient.post('/movies', data);
export const updateAdminMovie = (id, data) => apiClient.put(`/movies/${id}`, data);
export const deleteAdminMovie = (id) => apiClient.delete(`/movies/${id}`);

// Users (admin)
export const fetchUsers = () => apiClient.get('/users');
export const deleteUserById = (id) => apiClient.delete(`/users/${id}`);
export const banUserById = (id) => apiClient.put(`/users/ban/${id}`);

// Favorites
export const getFavorites = () => apiClient.get('/favorites');
export const addFavorite = (data) => apiClient.post('/favorites', data);
export const removeFavorite = (movieId) => apiClient.delete(`/favorites/${movieId}`);

// History
export const getHistory = () => apiClient.get('/history');
export const addToHistory = (data) => apiClient.post('/history', data);
export const clearHistory = () => apiClient.delete('/history');

export default apiClient;
