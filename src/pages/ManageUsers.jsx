import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

export default function ManageUsers() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState('')
  const [full_name, setFullName] = useState('')
  const [role, setRole] = useState('student')

  const load = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (res.ok) setUsers(data)
  }

  useEffect(() => { load() }, [])

  const createUser = async (e) => {
    e.preventDefault()
    await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email, full_name, role, password: 'Temp123!' })
    })
    setEmail(''); setFullName(''); setRole('student')
    load()
  }

  const promote = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: 'officer' })
    })
    load()
  }

  return (
    <div className="container">
      <Navbar />
      <div className="card">
        <h2>Manage Users</h2>
        <form onSubmit={createUser} className="row" style={{ flexDirection: 'column' }}>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Full name" value={full_name} onChange={e => setFullName(e.target.value)} />
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="officer">Officer</option>
          </select>
          {/* NOTE: DEVELOPER PHOTO PLACEHOLDER */}
          {/* NOTE: ADD PNG HERE */}
          <button type="submit">Create user</button>
        </form>
        <hr />
        <ul>
          {users.map(u => (
            <li key={u.id} className="row" style={{ justifyContent: 'space-between' }}>
              <span>{u.email} — {u.role}</span>
              {u.role !== 'officer' && <button onClick={() => promote(u.id)}>Promote to Officer</button>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
