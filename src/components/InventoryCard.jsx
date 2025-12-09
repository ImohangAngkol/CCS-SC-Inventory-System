import React from 'react'

export default function InventoryCard({ item, onBorrow, onReserve }) {
  return (
    <div className="card" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem' }}>
      {/* NOTE: ITEM IMAGE GOES HERE */}
      {/* NOTE: ADD PNG HERE */}
      <div style={{ width: 120, height: 90, background: 'var(--gray-300)', borderRadius: 8 }}></div>
      <div>
        <h3 style={{ margin: 0 }}>{item.name}</h3>
        <p style={{ margin: '0.25rem 0' }}>{item.description}</p>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <small>Available: {item.available_quantity}</small>
          <div className="row">
            <button onClick={() => onBorrow(item)} disabled={item.available_quantity <= 0}>Borrow</button>
            <button onClick={() => onReserve(item)}>Reserve</button>
          </div>
        </div>
      </div>
    </div>
  )
}
