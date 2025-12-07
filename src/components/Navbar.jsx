import React from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { role, logout } = useAuth()
  return (
    <nav className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div className="row">
        <strong>SCIS</strong>
        <Link to="/inventory">Inventory</Link>
        {role === 'student' && <Link to="/dashboard-student">Student</Link>}
        {role === 'officer' && <Link to="/dashboard-officer">Officer</Link>}
        <Link to="/developers">Developers</Link>
      </div>
      <div className="row">
        <ThemeToggle />
        <button onClick={logout} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--gray-300)' }}>
          Logout
        </button>
      </div>
    </nav>
  )
}
