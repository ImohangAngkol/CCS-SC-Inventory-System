// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname;

  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await login(form);
      // Post-login redirection handled in dashboards via role
      navigate(redirectTo || '/student', { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMsg('Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 460, margin: '5rem auto' }}>
        <h2>SCIS Login</h2>
        <form onSubmit={submit}>
          <div style={{ marginTop: '0.75rem' }}>
            <label>Email</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@domain.edu.ph"
            />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <label>Password</label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          {errorMsg && <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>{errorMsg}</p>}
          <button className="button" type="submit" style={{ marginTop: '0.75rem' }} disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
