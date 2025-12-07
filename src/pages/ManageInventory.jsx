import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

export default function ManageInventory() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('event')
  const [quantity, setQuantity] = useState(1)

  const load = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/items`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (res.ok) setItems(data)
  }

  useEffect(() => { load() }, [])

  const createItem = async (e) => {
    e.preventDefault()
    await fetch(`${import.meta.env.VITE_API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, description, category, total_quantity: quantity })
    })
    setName(''); setDescription(''); setQuantity(1)
    load()
  }

  const removeItem = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/items/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    load()
  }

  return (
    <div className="container">
      <Navbar />
      <div className="card">
        <h2>Manage Inventory</h2>
        <form onSubmit={createItem} className="row" style={{ flexDirection: 'column' }}>
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="event">Event</option>
            <option value="audio">Audio</option>
            <option value="visual">Visual</option>
          </select>
          <input placeholder="Total quantity" type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value || 1))} />
          {/* NOTE: ITEM IMAGE GOES HERE */}
          {/* NOTE: ADD PNG HERE */}
          <button type="submit">Add Item</button>
        </form>

        <hr />
        <ul>
          {items.map(i => (
            <li key={i.id} className="row" style={{ justifyContent: 'space-between' }}>
              <span>{i.name} — {i.category} — total {i.total_quantity}</span>
              <button onClick={() => removeItem(i.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
