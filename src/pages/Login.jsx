import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      // backend encodes role in JWT; navigate based on decoded role handled later in dashboards
      navigate('/inventory')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '3rem auto' }}>
        <h2>Login</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={onSubmit} className="row" style={{ flexDirection: 'column' }}>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
        <p>Don’t have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}
