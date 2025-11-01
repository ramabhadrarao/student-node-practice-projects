// Addresses page
// Simple CRUD UI: list addresses, add new, edit, delete
// All requests include the JWT token in the Authorization header

import { useEffect, useState } from 'react';

function getToken() {
  return localStorage.getItem('token');
}

export default function Addresses() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ line1: '', line2: '', city: '', state: '', zip: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ line1: '', line2: '', city: '', state: '', zip: '' });

  async function load() {
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/addresses', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Failed to load addresses');
        return;
      }
      setItems(data.items || []);
    } catch (err) {
      setMessage('Network error');
    }
  }

  useEffect(() => { load(); }, []);

  async function addAddress(e) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Failed to add address');
        return;
      }
      setForm({ line1: '', line2: '', city: '', state: '', zip: '' });
      await load();
    } catch (err) {
      setMessage('Network error');
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setEditForm({ line1: item.line1 || '', line2: item.line2 || '', city: item.city || '', state: item.state || '', zip: item.zip || '' });
  }

  async function saveEdit(id) {
    setMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Failed to update address');
        return;
      }
      setEditingId(null);
      await load();
    } catch (err) {
      setMessage('Network error');
    }
  }

  async function remove(id) {
    setMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Failed to delete address');
        return;
      }
      await load();
    } catch (err) {
      setMessage('Network error');
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8">
        <h2 className="mb-3">Addresses</h2>
        {message && <div className="alert alert-warning">{message}</div>}

        {/* Add new address */}
        <form onSubmit={addAddress} className="card p-3 shadow-sm mb-4">
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label">Line 1 *</label>
              <input className="form-control" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Line 2</label>
              <input className="form-control" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
            </div>
            <div className="col-md-4">
              <label className="form-label">City *</label>
              <input className="form-control" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">State *</label>
              <input className="form-control" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">ZIP *</label>
              <input className="form-control" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} required />
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-success">Add Address</button>
          </div>
        </form>

        {/* List addresses */}
        {items.length === 0 ? (
          <div className="alert alert-info">No addresses yet. Add one above.</div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="card p-3 shadow-sm mb-3">
              {editingId === item._id ? (
                <div>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label">Line 1 *</label>
                      <input className="form-control" value={editForm.line1} onChange={(e) => setEditForm({ ...editForm, line1: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Line 2</label>
                      <input className="form-control" value={editForm.line2} onChange={(e) => setEditForm({ ...editForm, line2: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">City *</label>
                      <input className="form-control" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">State *</label>
                      <input className="form-control" value={editForm.state} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">ZIP *</label>
                      <input className="form-control" value={editForm.zip} onChange={(e) => setEditForm({ ...editForm, zip: e.target.value })} required />
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-primary me-2" onClick={() => saveEdit(item._id)}>Save</button>
                    <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-1"><strong>{item.line1}</strong>{item.line2 ? `, ${item.line2}` : ''}</p>
                  <p className="mb-1">{item.city}, {item.state} {item.zip}</p>
                  <div className="mt-2">
                    <button className="btn btn-outline-primary btn-sm me-2" onClick={() => startEdit(item)}>Edit</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => remove(item._id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}