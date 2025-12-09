import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

export default function ReportIssue() {
  const { token } = useAuth()
  const [itemId, setItemId] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('low')
  const [message, setMessage] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setMessage(null)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ itemId, description, severity })
    })
    const data = await res.json()
    if (!res.ok) return setMessage(data.message || 'Issue reporting failed')
    setMessage('Issue reported')
  }

  return (
    <div className="container">
      <Navbar />
      <div className="card">
        <h2>Report Issue</h2>
        {message && <div>{message}</div>}
        <form onSubmit={submit} className="row" style={{ flexDirection: 'column' }}>
          <input placeholder="Item ID" value={itemId} onChange={e => setItemId(e.target.value)} />
          <textarea placeholder="Describe the issue..." value={description} onChange={e => setDescription(e.target.value)} />
          <select value={severity} onChange={e => setSeverity(e.target.value)}>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}
