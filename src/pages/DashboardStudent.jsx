import React from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

export default function DashboardStudent() {
  const { user } = useAuth()
  return (
    <div className="container">
      <Navbar />
      <div className="card">
        <h2>Student Dashboard</h2>
        <p>Welcome, {user?.email}</p>
        <ul>
          <li>View and filter inventory</li>
          <li>Borrow and reserve items</li>
          <li>Report issues</li>
        </ul>
      </div>
    </div>
  )
}
