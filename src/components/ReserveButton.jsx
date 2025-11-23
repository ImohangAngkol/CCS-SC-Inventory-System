// src/components/ReserveButton.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function ReserveButton({ item, onReserved }) {
  const { profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  async function reserve() {
    if (!profile?.id) return;
    setSubmitting(true);
    try {
      const { data: tx, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: profile.id,
          transaction_type: 'reservation',
          status: 'pending',
          transaction_date: new Date().toISOString(),
        })
        .select()
        .single();
      if (txError) throw txError;

      const { error: lineError } = await supabase.from('transaction_lines').insert({
        transaction_id: tx.id,
        item_id: item.id,
        line_status: 'pending',
        notes: `Reservation pending approval`,
      });
      if (lineError) throw lineError;

      // Optionally update item status to reserved if desired
      // Notify officers can be modeled as inserting into approvals with null decision
      await supabase.from('approvals').insert({
        transaction_id: tx.id,
        officer_id: null,
        decision: null,
        approval_date: null,
        notes: 'Awaiting officer approval',
      });

      onReserved?.();
    } catch (err) {
      console.error(err);
      alert('Reservation failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button
      className="button"
      style={{ borderColor: '#f59e0b' }}
      onClick={reserve}
      disabled={submitting}
      aria-label={`Reserve ${item.item_name}`}
    >
      {submitting ? 'Reserving...' : 'Reserve'}
    </button>
  );
}
