// src/components/InventoryList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';

const statusColors = {
  available: 'badge available',
  borrowed: 'badge borrowed',
  reserved: 'badge reserved',
  damaged: 'badge damaged',
};

export default function InventoryList({
  onBorrowClick,
  onReserveClick,
  allowBorrow = true,
  allowReserve = true,
}) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadItems() {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('id, item_name, description, image_url, current_quantity, status')
        .order('item_name', { ascending: true });
      if (!error && isMounted) setItems(data ?? []);
      setLoading(false);
    }
    loadItems();

    const channel = supabase
      .channel('inventory-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        (payload) => {
          // Refresh on any change
          setItems((prev) => {
            const clone = [...prev];
            const idx = clone.findIndex((it) => it.id === payload.new?.id);
            if (idx >= 0) {
              clone[idx] = payload.new;
              return clone;
            }
            return [payload.new, ...clone];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((it) => it.status?.toLowerCase() === filter);
  }, [items, filter]);

  if (loading) return <div className="card">Loading inventory...</div>;

  return (
    <div className="card">
      <div className="row" style={{ alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <select
            className="select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter items by status"
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="reserved">Reserved</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ opacity: 0.7 }}>Filter the inventory by status</span>
        </div>
      </div>

      <div className="row">
        {filtered.map((item) => (
          <div className="card" key={item.id} style={{ width: '320px' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <img
                src={item.image_url || 'https://via.placeholder.com/80x80?text=SCIS'}
                alt={item.item_name}
                width={80}
                height={80}
                style={{ objectFit: 'cover', borderRadius: 8 }}
              />
              <div>
                <h4 style={{ margin: '0 0 0.25rem' }}>{item.item_name}</h4>
                <div className={statusColors[item.status?.toLowerCase()] || 'badge'}>
                  {item.status}
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.85 }}>
                  {item.description}
                </p>
                <p style={{ marginTop: '0.25rem', fontSize: '0.85rem', opacity: 0.75 }}>
                  Qty: {item.current_quantity}
                </p>
              </div>
            </div>

            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
              {allowBorrow && item.status?.toLowerCase() === 'available' && (
                <button className="button" onClick={() => onBorrowClick?.(item)}>
                  Borrow
                </button>
              )}
              {allowReserve && item.status?.toLowerCase() !== 'available' && (
                <button
                  className="button"
                  style={{ borderColor: '#f59e0b' }}
                  onClick={() => onReserveClick?.(item)}
                >
                  Reserve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p>No items match this filter.</p>}
    </div>
  );
}
