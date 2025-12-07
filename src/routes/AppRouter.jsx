import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import DashboardStudent from '../pages/DashboardStudent'
import DashboardOfficer from '../pages/DashboardOfficer'
import Inventory from '../pages/Inventory'
import Borrow from '../pages/Borrow'
import Reserve from '../pages/Reserve'
import ReportIssue from '../pages/ReportIssue'
import ManageInventory from '../pages/ManageInventory'
import ManageUsers from '../pages/ManageUsers'
import Developers from '../pages/Developers'
import ProtectedRoute from './ProtectedRoute'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard-student"
        element={<ProtectedRoute allowed={['student']}><DashboardStudent /></ProtectedRoute>}
      />
      <Route
        path="/dashboard-officer"
        element={<ProtectedRoute allowed={['officer']}><DashboardOfficer /></ProtectedRoute>}
      />
      <Route
        path="/inventory"
        element={<ProtectedRoute allowed={['student','officer']}><Inventory /></ProtectedRoute>}
      />
      <Route
        path="/borrow"
        element={<ProtectedRoute allowed={['student','officer']}><Borrow /></ProtectedRoute>}
      />
      <Route
        path="/reserve"
        element={<ProtectedRoute allowed={['student','officer']}><Reserve /></ProtectedRoute>}
      />
      <Route
        path="/report-issue"
        element={<ProtectedRoute allowed={['student','officer']}><ReportIssue /></ProtectedRoute>}
      />
      <Route
        path="/manage-inventory"
        element={<ProtectedRoute allowed={['officer']}><ManageInventory /></ProtectedRoute>}
      />
      <Route
        path="/manage-users"
        element={<ProtectedRoute allowed={['officer']}><ManageUsers /></ProtectedRoute>}
      />
      <Route
        path="/developers"
        element={<ProtectedRoute allowed={['student','officer']}><Developers /></ProtectedRoute>}
      />
    </Routes>
  )
}
