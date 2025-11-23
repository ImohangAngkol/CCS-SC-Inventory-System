// src/pages/ReservationRequests.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ReservationRequests() {
  const { logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('transactions')
      .select('id, user_id, transaction_date, status, transaction_lines ( item_id, items ( item_name, image_url ) ), users ( full_name, school_id )')
      .eq('transaction_type', 'reservation')
      .eq('status', 'pending')
      .order('transaction_date', { ascending: false });
    setRequests(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(txId) {
    // update transaction to reserved and line to active or reserved
    const { error } = await supabase.from('transactions').update({ status: 'approved' }).eq('id', txId);
    if (!error) {
      await supabase.from('transaction_lines').update({ line_status: 'active' }).eq('transaction_id', txId);
      // create approval record
      await supabase.from('approvals').insert({
        transaction_id: txId,
        decision: 'approved',
        approval_date: new Date().toISOString(),
      });
      load();
    }
  }

  async function reject(txId) {
    const { error } = await supabase.from('transactions').update({ status: 'rejected' }).eq('id', txId);
    if (!error) {
      await supabase.from('transaction_lines').update({ line_status: 'pending' }).eq('transaction_id', txId);
      await supabase.from('approvals').insert({
        transaction_id: txId,
        decision: 'rejected',
        approval_date: new Date().toISOString(),
      });
      load();
    }
  }

  return (
    <div className="container">
      <header className="row" style={{ alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Reservation Requests</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
          <Link className="button" to="/officer">Back</Link>
          <button className="button" onClick={logout} style={{ borderColor: '#ef4444' }}>
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <div className="card">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="card">There are no pending reservations.</div>
      ) : (
        <div className="row">
          {requests.map((tx) => {
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
                    <p style={{ opacity: 0.75 }}>
                      Requested by: {tx.users?.full_name} ({tx.users?.school_id})
                    </p>
                    <p style={{ opacity: 0.75 }}>Date: {new Date(tx.transaction_date).toLocaleString()}</p>
                    <div className="badge reserved">Pending</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button className="button" onClick={() => approve(tx.id)} style={{ borderColor: '#10b981' }}>
                    Approve
                  </button>
                  <button className="button" onClick={() => reject(tx.id)} style={{ borderColor: '#ef4444' }}>
                    Reject
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
