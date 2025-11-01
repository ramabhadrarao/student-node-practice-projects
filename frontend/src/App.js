// Main App component: defines routes for Login, Register, and Dashboard
// This is kept simple and commented for student learning.

import './App.css';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Addresses from './components/Addresses';

// Helper: get auth token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

function App() {
  const navigate = useNavigate();

  // Simple logout: remove token and navigate to login
  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const isLoggedIn = !!getToken();

  return (
    <div className="container py-4">
      {/* Simple header with navigation */}
      <nav className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/" className="text-decoration-none fw-bold">Student Auth Demo</Link>
        <div>
          {isLoggedIn ? (
            <>
              <Link to="/addresses" className="btn btn-outline-primary btn-sm me-2">Addresses</Link>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-sm me-2">Login</Link>
              <Link to="/register" className="btn btn-secondary btn-sm">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* Define app routes */}
      <Routes>
        {/* Default route: if logged in, go to dashboard; else go to login */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protect dashboard by checking token; for demo, redirect if not logged in */}
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        {/* Protected Addresses page */}
        <Route path="/addresses" element={isLoggedIn ? <Addresses /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
