// src/pages/ManageInventory.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ItemForm from '../components/ItemForm';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ManageInventory() {
  const { logout } = useAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  async function load() {
    const { data } = await supabase
      .from('items')
      .select('id, item_name, description, image_url, current_quantity, status')
      .order('item_name', { ascending: true });
    setItems(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function removeItem(id) {
    if (!window.confirm('Delete this item?')) return;
    const { error } = await supabase.from('items').delete().eq('id', id);
    if (!error) load();
  }

  async function setStatus(id, status) {
    const { error } = await supabase.from('items').update({ status }).eq('id', id);
    if (!error) load();
  }

  return (
    <div className="container">
      <header className="row" style={{ alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Manage Inventory</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
          <Link className="button" to="/officer">Back</Link>
          <button className="button" onClick={logout} style={{ borderColor: '#ef4444' }}>Logout</button>
        </div>
      </header>

      <button className="button" onClick={() => setAdding(true)}>Add New Item</button>

      {adding && (
        <ItemForm
          onSaved={() => {
            setAdding(false);
            load();
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="row" style={{ marginTop: '1rem' }}>
        {items.map((item) => (
          <div className="card" key={item.id} style={{ width: 360 }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <img
                src={item.image_url || 'https://via.placeholder.com/80x80?text=SCIS'}
                alt={item.item_name}
                width={80}
                height={80}
                style={{ objectFit: 'cover', borderRadius: 8 }}
              />
              <div>
                <h4 style={{ margin: 0 }}>{item.item_name}</h4>
                <p style={{ opacity: 0.75 }}>{item.description}</p>
                <p style={{ opacity: 0.75 }}>Qty: {item.current_quantity}</p>
                <p>Status: <span className="badge">{item.status}</span></p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button className="button" onClick={() => setEditing(item)}>Edit</button>
              <button className="button" onClick={() => removeItem(item.id)} style={{ borderColor: '#ef4444' }}>
                Delete
              </button>
              <button className="button" onClick={() => setStatus(item.id, 'available')} style={{ borderColor: '#10b981' }}>
                Mark Available
              </button>
              <button className="button" onClick={() => setStatus(item.id, 'damaged')} style={{ borderColor: '#ef4444' }}>
                Mark Damaged
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ItemForm
          initialItem={editing}
          onSaved={() => {
            setEditing(null);
            load();
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
