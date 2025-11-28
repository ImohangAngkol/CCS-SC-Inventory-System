import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/forms.css';
import { auth } from '../../utils/auth';
import { toastError, toastSuccess } from '../../utils/toast';

export default function LoginPage() {
  const nav = useNavigate();
  const [role, setRole] = useState<'student'|'officer'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submit = () => {
    if (!name || !email) {
      toastError('Login failed', 'Name and email are required');
      return;
    }
    try {
      auth.login(role, email, name);
      toastSuccess('Logged in', `Welcome, ${name}`);
      nav(role === 'student' ? '/student' : '/officer');
    } catch (e: any) {
      toastError('Login error', e?.message ?? 'Unknown error');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <div className="card">
        <div className="form-field">
          <label className="required">Role</label>
          <select className="select" value={role} onChange={e => setRole(e.target.value as any)}>
            <option value="student">Student</option>
            <option value="officer">Officer</option>
          </select>
        </div>
        <div className="form-field">
          <label className="required">Name</label>
          <input className="input" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="required">Email</label>
          <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="inline">
          <button className="btn" onClick={submit}>Login</button>
        </div>
      </div>
    </div>
  );
}
