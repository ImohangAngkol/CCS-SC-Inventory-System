import { Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import './styles/globals.css';

export default function App() {
  const loc = useLocation();
  return (
    <>
      <Navbar />
      <Outlet />
      <ToastContainer />
      <footer className="container" style={{ marginTop: '2rem', color: 'var(--muted)' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span>© {new Date().getFullYear()} SCIS Prototype</span>
          <span>Theme: <code>{document.documentElement.getAttribute('data-theme') || 'light'}</code> · <Link to="/about">Credits</Link></span>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          <strong>Route:</strong> {loc.pathname}{loc.search}
        </div>
      </footer>
    </>
  );
}
