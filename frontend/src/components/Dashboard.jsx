// Dashboard component
// Shows a welcome message to the logged-in user and a simple info panel
// Fetches current user using the stored JWT token

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage(data.message || 'Failed to load user');
          return;
        }
        setUser(data.user);
      } catch (err) {
        setMessage('Network error');
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <h2 className="mb-3">Welcome Dashboard</h2>
        {message && <div className="alert alert-warning">{message}</div>}
        {user ? (
          <div className="card p-3 shadow-sm">
            <p className="mb-1"><strong>Name:</strong> {user.name}</p>
            <p className="mb-1"><strong>Email:</strong> {user.email}</p>
            <p className="text-muted">You are logged in. Use the Logout button in the header anytime.</p>
          </div>
        ) : (
          <div className="alert alert-info">Loading your info...</div>
        )}
      </div>
    </div>
  );
}