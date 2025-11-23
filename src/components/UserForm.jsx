// src/components/UserForm.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function UserForm({ onSaved }) {
  const [form, setForm] = useState({
    full_name: '',
    school_id: '',
    email: '',
    contact_number: '',
    role: 'student',
    password: '',
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function save(e) {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);
    try {
      // Validate unique school_id
      const { data: exists } = await supabase.from('users').select('id').eq('school_id', form.school_id);
      if (exists && exists.length > 0) {
        setErrorMsg('School ID already exists.');
        setSaving(false);
        return;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password || crypto.randomUUID(),
      });
      if (authError) throw authError;

      // Create profile record
      const { error: profileError } = await supabase.from('users').insert({
        auth_user_id: authData.user.id,
        full_name: form.full_name,
        school_id: form.school_id,
        email: form.email,
        contact_number: form.contact_number,
        role: form.role,
        created_at: new Date().toISOString(),
      });
      if (profileError) throw profileError;

      onSaved?.();
      setForm({
        full_name: '',
        school_id: '',
        email: '',
        contact_number: '',
        role: 'student',
        password: '',
      });
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to register user.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="card">
      <h3>Register New User</h3>
      <div className="row">
        <div style={{ flex: 1 }}>
          <label>Full Name</label>
          <input
            className="input"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </div>
        <div style={{ width: 220 }}>
          <label>School ID</label>
          <input
            className="input"
            value={form.school_id}
            onChange={(e) => setForm({ ...form, school_id: e.target.value })}
          />
        </div>
      </div>
      <div className="row" style={{ marginTop: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <label>Email</label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div style={{ width: 220 }}>
          <label>Contact Number</label>
          <input
            className="input"
            value={form.contact_number}
            onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
          />
        </div>
      </div>
      <div className="row" style={{ marginTop: '0.75rem' }}>
        <div style={{ width: 220 }}>
          <label>Role</label>
          <select
            className="select"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="officer">Officer</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label>Password (temporary)</label>
          <input
            className="input"
            type="text"
            placeholder="Generate or set a temporary password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
      </div>

      {errorMsg && <p style={{ color: '#ef4444' }}>{errorMsg}</p>}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button className="button" type="submit" disabled={saving}>
          {saving ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
}
