// src/pages/RecentlyReturned.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RecentlyReturned() {
  const { logout } = useAuth();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from('transactions')
      .select('id, user_id, return_date, status, transaction_lines ( item_id, items ( item_name, image_url ) ), users ( full_name )')
      .eq('transaction_type', 'return')
      .gte('return_date', since)
      .order('return_date', { ascending: false });
    setReturns(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function markItemStatus(itemId, status) {
    const { error } = await supabase.from('items').update({ status }).eq('id', itemId);
    if (!error) load();
  }

  return (
    <div className="container">
      <header className="row" style={{ alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Recently Returned</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
          <Link className="button" to="/officer">Back</Link>
          <button className="button" onClick={logout} style={{ borderColor: '#ef4444' }}>
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <div className="card">Loading...</div>
      ) : returns.length === 0 ? (
        <div className="card">No items have been returned recently.</div>
      ) : (
        <div className="row">
          {returns.map((tx) => {
            const line = tx.transaction_lines?.[0];
            const item = line?.items;
            return (
              <div className="card" key={tx.id} style={{ width: 380 }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <img
                    src={item?.image_url || 'https://via.placeholder.com/80x80?text=SCIS'}
                    alt={item?.item_name}
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                  <div>
                    <h4 style={{ margin: 0 }}>{item?.item_name || 'Item'}</h4>
                    <p style={{ opacity: 0.75 }}>Returned by: {tx.users?.full_name}</p>
                    <p style={{ opacity: 0.75 }}>
                      Return Date: {tx.return_date ? new Date(tx.return_date).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button className="button" onClick={() => markItemStatus(line.item_id, 'available')} style={{ borderColor: '#10b981' }}>
                    Mark Available
                  </button>
                  <button className="button" onClick={() => markItemStatus(line.item_id, 'damaged')} style={{ borderColor: '#ef4444' }}>
                    Mark Damaged
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
