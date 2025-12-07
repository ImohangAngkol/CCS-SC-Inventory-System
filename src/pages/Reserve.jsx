import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

export default function Reserve() {
  const { token } = useAuth()
  const [itemId, setItemId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [reservedDate, setReservedDate] = useState('')
  const [message, setMessage] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setMessage(null)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/transactions/reserve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ itemId, quantity, reservedDate })
    })
    const data = await res.json()
    if (!res.ok) return setMessage(data.message || 'Reserve failed')
    setMessage('Reservation created')
  }

  return (
    <div className="container">
      <Navbar />
      <div className="card">
        <h2>Reserve Item</h2>
        {message && <div>{message}</div>}
        <form onSubmit={submit} className="row" style={{ flexDirection: 'column' }}>
          <input placeholder="Item ID" value={itemId} onChange={e => setItemId(e.target.value)} />
          <input placeholder="Quantity" type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value || 1))} />
          <input placeholder="Reserved Date (YYYY-MM-DD)" value={reservedDate} onChange={e => setReservedDate(e.target.value)} />
          <button type="submit">Reserve</button>
        </form>
      </div>
    </div>
  )
}
