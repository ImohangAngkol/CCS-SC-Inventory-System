
import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import InventoryCard from '../components/InventoryCard'
import Pagination from '../components/Pagination'
import { supabase } from '../context/SupabaseClient'

const PAGE_SIZE = 6

export default function Inventory() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setItems(data || [])
    }
    fetchItems()

    const channel = supabase
      .channel('inventory-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, payload => {
        // naive refresh for clarity
        fetchItems()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filtered = useMemo(() => {
    return items.filter(i => {
      const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || i.category === category
      return matchesSearch && matchesCategory
    })
  }, [items, search, category])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const onBorrow = async (item) => {
    alert(`Borrow requested: ${item.name}`)
  }
  const onReserve = async (item) => {
    alert(`Reserve requested: ${item.name}`)
  }

  return (
    <div className="container">
      <Navbar />
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="all">All</option>
            <option value="audio">Audio</option>
            <option value="visual">Visual</option>
            <option value="event">Event</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          {visible.map(item => (
            <InventoryCard key={item.id} item={item} onBorrow={onBorrow} onReserve={onReserve} />
          ))}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}


