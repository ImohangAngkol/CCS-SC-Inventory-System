import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowed }) {
  const { token, role, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!token) return <Navigate to="/login" replace />
  if (allowed && !allowed.includes(role)) return <Navigate to="/login" replace />
  return children
}
