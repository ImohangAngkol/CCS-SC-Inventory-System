// src/pages/StudentDashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import InventoryList from '../components/InventoryList';
import BorrowModal from '../components/BorrowModal';
import { Link, Navigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { role, logout } = useAuth();
  const [borrowItem, setBorrowItem] = useState(null);

  if (role === 'officer') return <Navigate to="/officer" replace />;

  return (
    <div className="container">
      <header className="row" style={{ alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Student Dashboard</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
          <Link className="button" to="/student/borrowed">My Borrowed Items</Link>
          <button className="button" onClick={logout} style={{ borderColor: '#ef4444' }}>
            Logout
          </button>
        </div>
      </header>

      <InventoryList
        onBorrowClick={(item) => setBorrowItem(item)}
        onReserveClick={(item) => alert(`Reservation initiated for ${item.item_name}. Go to reservations view to track.`)}
        allowBorrow
        allowReserve
      />

      {borrowItem && (
        <BorrowModal
          item={borrowItem}
          onClose={() => setBorrowItem(null)}
          onSuccess={() => {
            setBorrowItem(null);
          }}
        />
      )}
    </div>
  );
}
