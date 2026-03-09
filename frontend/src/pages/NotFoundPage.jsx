import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => (
  <div className="notfound-page">
    <div className="notfound-content">
      <div className="notfound-code">404</div>
      <h1 className="notfound-title">Page Not Found</h1>
      <p className="notfound-desc">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary notfound-btn">🏠 Go Home</Link>
    </div>
  </div>
);

export default NotFoundPage;
