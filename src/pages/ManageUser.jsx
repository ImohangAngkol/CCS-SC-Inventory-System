// src/pages/ManageUsers.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserForm from '../components/UserForm';

export default function ManageUsers() {
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('users')
      .select('id, full_name, school_id, email, contact_number, role, created_at')
      .order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function deactivate(id) {
    if (!window.confirm('Deactivate this user?')) return;
    const { error } = await supabase.from('users').update({ role: 'student_disabled' }).eq('id', id);
    if (!error) load();
  }

  return (
    <div className="container">
      <header className="row" style={{ alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Manage Users</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
          <Link className="button" to="/officer">Back</Link>
          <button className="button" onClick={logout} style={{ borderColor: '#ef4444' }}>
            Logout
          </button>
        </div>
      </header>

      <UserForm onSaved={load} />

      <div className="card" style={{ marginTop: '1rem' }}>
        <h3>Existing Users</h3>
        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="row">
            {users.map((u) => (
              <div className="card" key={u.id} style={{ width: 360 }}>
                <h4 style={{ margin: 0 }}>{u.full_name}</h4>
                <p style={{ opacity: 0.75 }}>School ID: {u.school_id}</p>
                <p style={{ opacity: 0.75 }}>Email: {u.email}</p>
                <p style={{ opacity: 0.75 }}>Contact: {u.contact_number}</p>
                <p>Role: <span className="badge">{u.role}</span></p>
                <button className="button" onClick={() => deactivate(u.id)} style={{ borderColor: '#ef4444' }}>
                  Deactivate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
