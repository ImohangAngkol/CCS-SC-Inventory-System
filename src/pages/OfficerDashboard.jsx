// src/pages/OfficerDashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import InventoryList from '../components/InventoryList';

export default function OfficerDashboard() {
  const { role, logout } = useAuth();
  if (role === 'student') return <Navigate to="/student" replace />;

  return (
    <div className="container">
      <header className="row" style={{ alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Officer Dashboard</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
          <Link className="button" to="/officer/inventory">Manage Inventory</Link>
          <Link className="button" to="/officer/reservations">Reservation Requests</Link>
          <Link className="button" to="/officer/returned">Recently Returned</Link>
          <Link className="button" to="/officer/users">Manage Users</Link>
          <button className="button" onClick={logout} style={{ borderColor: '#ef4444' }}>
            Logout
          </button>
        </div>
      </header>

      <InventoryList allowBorrow={false} allowReserve={false} />
    </div>
  );
}
