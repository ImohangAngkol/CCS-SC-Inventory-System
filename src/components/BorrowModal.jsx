// src/components/BorrowModal.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function BorrowModal({ item, onClose, onSuccess }) {
  const { profile } = useAuth();
  const [form, setForm] = useState({
    school_id: profile?.school_id || '',
    contact_number: profile?.contact_number || '',
    messenger_id: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!item) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    if (!form.school_id || !form.contact_number || !form.messenger_id) {
      setErrorMsg('Please complete all fields.');
      return;
    }

    setSubmitting(true);
    try {
      // Create transaction header (type = borrow, status = active/borrowed)
      const { data: tx, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: profile?.id,
          transaction_type: 'borrow',
          status: 'active',
          transaction_date: new Date().toISOString(),
          due_date: null,
          return_date: null,
        })
        .select()
        .single();

      if (txError) throw txError;

      // Create transaction line linking item instance or item id
      const { error: lineError } = await supabase.from('transaction_lines').insert({
        transaction_id: tx.id,
        item_id: item.id,
        line_status: 'active',
        notes: `Borrowed by ${profile?.full_name} (Messenger: ${form.messenger_id})`,
      });
      if (lineError) throw lineError;

      // Decrease quantity and update item status
      const nextQty = Math.max((item.current_quantity || 1) - 1, 0);
      const nextStatus = nextQty === 0 ? 'unavailable' : item.status;
      const { error: itemError } = await supabase
        .from('items')
        .update({ current_quantity: nextQty, status: nextStatus })
        .eq('id', item.id);
      if (itemError) throw itemError;

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      setErrorMsg('Borrow failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2,6,23,0.7)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 50,
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="card" style={{ width: '560px' }}>
        <h3>Borrow "{item.item_name}"</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginTop: '0.75rem' }}>
            <label>School ID</label>
            <input
              className="input"
              value={form.school_id}
              onChange={(e) => setForm({ ...form, school_id: e.target.value })}
              placeholder="e.g., 2021-1234"
            />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <label>Contact Number</label>
            <input
              className="input"
              value={form.contact_number}
              onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
              placeholder="e.g., 09xxxxxxxxx"
            />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <label>Messenger ID</label>
            <input
              className="input"
              value={form.messenger_id}
              onChange={(e) => setForm({ ...form, messenger_id: e.target.value })}
              placeholder="Messenger username"
            />
          </div>

          {errorMsg && <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>{errorMsg}</p>}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="submit" className="button" disabled={submitting}>
              {submitting ? 'Processing...' : 'Confirm Borrow'}
            </button>
            <button type="button" className="button" onClick={onClose} style={{ borderColor: '#64748b' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
