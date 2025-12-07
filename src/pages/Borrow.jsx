import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

export default function Borrow() {
  const { token } = useAuth()
  const [itemId, setItemId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setMessage(null)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/transactions/borrow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ itemId, quantity })
    })
    const data = await res.json()
    if (!res.ok) return setMessage(data.message || 'Borrow failed')
    setMessage('Borrow created')
  }

  return (
    <div className="container">
      <Navbar />
      <div className="card">
        <h2>Borrow Item</h2>
        {message && <div>{message}</div>}
        <form onSubmit={submit} className="row" style={{ flexDirection: 'column' }}>
          <input placeholder="Item ID" value={itemId} onChange={e => setItemId(e.target.value)} />
          <input placeholder="Quantity" type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value || 1))} />
          <button type="submit">Borrow</button>
        </form>
      </div>
    </div>
  )
}
