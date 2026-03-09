import React, { useState, useEffect } from 'react';
import { fetchUsers, deleteUserById, banUserById, fetchAdminMovies, createAdminMovie, updateAdminMovie, deleteAdminMovie } from '../services/apiService';
import './AdminDashboard.css';

const TABS = ['Movies', 'Users'];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Movies');
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState({ title: '', posterUrl: '', description: '', movieId: '', releaseDate: '', trailerLink: '', genre: '', category: 'movie', rating: '' });
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const showMsg = (msg, isError = false) => {
    if (isError) setError(msg);
    else setFeedback(msg);
    setTimeout(() => { setFeedback(''); setError(''); }, 3000);
  };

  const loadMovies = async () => {
    setMoviesLoading(true);
    try { const res = await fetchAdminMovies({}); setMovies(res.data.data); }
    catch { showMsg('Failed to load movies', true); }
    finally { setMoviesLoading(false); }
  };
  const loadUsers = async () => {
    setUsersLoading(true);
    try { const res = await fetchUsers(); setUsers(res.data.data); }
    catch { showMsg('Failed to load users', true); }
    finally { setUsersLoading(false); }
  };

  useEffect(() => { loadMovies(); loadUsers(); }, []);

  const handleMovieFormChange = (e) => setMovieForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const openAddForm = () => {
    setEditingMovie(null);
    setMovieForm({ title: '', posterUrl: '', description: '', movieId: '', releaseDate: '', trailerLink: '', genre: '', category: 'movie', rating: '' });
    setShowMovieForm(true);
  };
  const openEditForm = (movie) => {
    setEditingMovie(movie);
    setMovieForm({ title: movie.title, posterUrl: movie.posterUrl, description: movie.description, movieId: movie.movieId, releaseDate: movie.releaseDate, trailerLink: movie.trailerLink, genre: movie.genre?.join(', ') || '', category: movie.category, rating: movie.rating });
    setShowMovieForm(true);
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...movieForm, genre: movieForm.genre.split(',').map(g => g.trim()).filter(Boolean), rating: Number(movieForm.rating) || 0 };
    try {
      if (editingMovie) { await updateAdminMovie(editingMovie._id, payload); showMsg('Movie updated!'); }
      else { await createAdminMovie(payload); showMsg('Movie added!'); }
      setShowMovieForm(false);
      loadMovies();
    } catch (err) { showMsg(err.response?.data?.message || 'Failed to save movie', true); }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try { await deleteAdminMovie(id); showMsg('Movie deleted'); loadMovies(); }
    catch { showMsg('Failed to delete movie', true); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await deleteUserById(id); showMsg('User deleted'); loadUsers(); }
    catch { showMsg('Failed to delete user', true); }
  };

  const handleBanUser = async (id) => {
    try { const res = await banUserById(id); showMsg(res.data.message); loadUsers(); }
    catch { showMsg('Failed to update user', true); }
  };

  return (
    <div className="page-content admin-page">
      <div className="container">
        <h1 className="page-heading">⚙️ Admin Dashboard</h1>

        {feedback && <div className="admin-feedback success">{feedback}</div>}
        {error && <div className="admin-feedback error">{error}</div>}

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map((tab) => (
            <button key={tab} className={`admin-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>

        {/* Movies Tab */}
        {activeTab === 'Movies' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Movies ({movies.length})</h2>
              <button className="btn btn-primary" onClick={openAddForm}>+ Add Movie</button>
            </div>

            {/* Movie Form Modal */}
            {showMovieForm && (
              <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowMovieForm(false); }}>
                <div className="modal-content admin-modal">
                  <button className="modal-close" onClick={() => setShowMovieForm(false)}>✕</button>
                  <h2 className="modal-title">{editingMovie ? 'Edit Movie' : 'Add Movie'}</h2>
                  <form onSubmit={handleMovieSubmit} className="admin-form">
                    <div className="admin-form-grid">
                      {[
                        { name: 'title', label: 'Title', type: 'text', required: true },
                        { name: 'movieId', label: 'TMDB Movie ID', type: 'text', required: true },
                        { name: 'posterUrl', label: 'Poster URL', type: 'text' },
                        { name: 'releaseDate', label: 'Release Date', type: 'date' },
                        { name: 'trailerLink', label: 'Trailer YouTube ID', type: 'text' },
                        { name: 'rating', label: 'Rating (0-10)', type: 'number' },
                        { name: 'genre', label: 'Genres (comma-separated)', type: 'text' },
                      ].map(({ name, label, type, required }) => (
                        <div key={name} className="form-group">
                          <label className="form-label">{label}</label>
                          <input type={type} name={name} className="form-input" value={movieForm[name] || ''} onChange={handleMovieFormChange} required={required} />
                        </div>
                      ))}
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select name="category" className="form-input" value={movieForm.category} onChange={handleMovieFormChange}>
                          {['trending', 'popular', 'movie', 'tv', 'people'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea name="description" className="form-input" rows={4} value={movieForm.description} onChange={handleMovieFormChange} />
                    </div>
                    <div className="admin-form-actions">
                      <button type="button" className="btn btn-outline" onClick={() => setShowMovieForm(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary">{editingMovie ? 'Update Movie' : 'Add Movie'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {moviesLoading ? (
              <div className="spinner-wrapper"><div className="spinner" /></div>
            ) : movies.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🎬</div><h3>No movies added yet</h3><p>Add your first movie using the button above</p></div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>Poster</th><th>Title</th><th>TMDB ID</th><th>Category</th><th>Rating</th><th>Actions</th></tr></thead>
                  <tbody>
                    {movies.map((movie) => (
                      <tr key={movie._id}>
                        <td><img src={movie.posterUrl || '/placeholder.jpg'} alt={movie.title} className="admin-movie-thumb" /></td>
                        <td className="admin-movie-title">{movie.title}</td>
                        <td><code>{movie.movieId}</code></td>
                        <td><span className="badge">{movie.category}</span></td>
                        <td>{movie.rating > 0 ? `⭐ ${movie.rating}` : '—'}</td>
                        <td>
                          <div className="admin-actions">
                            <button className="btn btn-outline admin-btn" onClick={() => openEditForm(movie)}>✏️ Edit</button>
                            <button className="btn admin-btn danger-btn" onClick={() => handleDeleteMovie(movie._id)}>🗑 Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'Users' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Users ({users.length})</h2>
            </div>
            {usersLoading ? (
              <div className="spinner-wrapper"><div className="spinner" /></div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className={user.banned ? 'banned-row' : ''}>
                        <td className="user-name-cell">
                          <div className="user-avatar-sm">{user.name?.charAt(0) || 'U'}</div>
                          {user.name}
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>{user.role}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.banned ? 'banned' : 'active'}`}>
                            {user.banned ? '🚫 Banned' : '✅ Active'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          {user.role !== 'admin' && (
                            <div className="admin-actions">
                              <button className={`btn admin-btn ${user.banned ? 'btn-outline' : 'danger-btn'}`} onClick={() => handleBanUser(user._id)}>
                                {user.banned ? '✅ Unban' : '🚫 Ban'}
                              </button>
                              <button className="btn admin-btn danger-btn" onClick={() => handleDeleteUser(user._id)}>🗑 Delete</button>
                            </div>
                          )}
                          {user.role === 'admin' && <span className="text-muted-sm">Admin</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
