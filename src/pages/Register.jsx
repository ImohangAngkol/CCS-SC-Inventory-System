import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const { signup } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [full_name, setFullName] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await signup({ email, password, full_name, role })
      navigate('/login')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: '3rem auto' }}>
        <h2>Register</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={onSubmit} className="row" style={{ flexDirection: 'column' }}>
          <input placeholder="Full name" value={full_name} onChange={e => setFullName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="officer">Officer</option>
          </select>
          <button type="submit">Create account</button>
        </form>
      </div>
    </div>
  )
}
