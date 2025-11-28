import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--accent)' }} />
        <Link to="/">SCIS</Link>
        <Link to="/inventory" style={{ marginLeft: '1rem' }}>Inventory</Link>
        <Link to="/qr">QR</Link>
        <Link to="/about">About</Link>
      </div>
      <div className="inline">
        <Link className="btn secondary" to="/login">Login</Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
