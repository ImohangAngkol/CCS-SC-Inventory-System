import React from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

export default function DashboardOfficer() {
  const { user } = useAuth()
  return (
    <div className="container">
      <Navbar />
      <div className="card">
        <h2>Officer Dashboard</h2>
        <p>Welcome, {user?.email}</p>
        <ul>
          <li>Manage inventory and users</li>
          <li>Approve/track transactions</li>
          <li>Review and resolve issues</li>
        </ul>
      </div>
    </div>
  )
}
