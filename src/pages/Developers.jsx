import React from 'react'
import Navbar from '../components/Navbar'

export default function Developers() {
  return (
    <div className="container">
      <Navbar />
      <div className="card">
        <h2>Developers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="card">
            {/* NOTE: DEVELOPER PHOTO PLACEHOLDER */}
            {/* NOTE: ADD PNG HERE */}
            <div style={{ width: '100%', height: 120, background: 'var(--gray-300)', borderRadius: 8 }}></div>
            <h3>Developer 1</h3>
            <p>Role: Frontend</p>
          </div>
          <div className="card">
            {/* NOTE: DEVELOPER PHOTO PLACEHOLDER */}
            {/* NOTE: ADD PNG HERE */}
            <div style={{ width: '100%', height: 120, background: 'var(--gray-300)', borderRadius: 8 }}></div>
            <h3>Developer 2</h3>
            <p>Role: Backend</p>
          </div>
          <div className="card">
            {/* NOTE: DEVELOPER PHOTO PLACEHOLDER */}
            {/* NOTE: ADD PNG HERE */}
            <div style={{ width: '100%', height: 120, background: 'var(--gray-300)', borderRadius: 8 }}></div>
            <h3>Developer 3</h3>
            <p>Role: UI/UX</p>
          </div>
          <div className="card">
            {/* NOTE: DEVELOPER PHOTO PLACEHOLDER */}
            {/* NOTE: ADD PNG HERE */}
            <div style={{ width: '100%', height: 120, background: 'var(--gray-300)', borderRadius: 8 }}></div>
            <h3>Developer 4</h3>
            <p>Role: QA</p>
          </div>
        </div>
      </div>
    </div>
  )
}
