// src/pages/BorrowedItems.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import IssueReportForm from '../components/IssueReportForm';
import { Link } from 'react-router-dom';

export default function BorrowedItems() {
  const { profile, logout } = useAuth();
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportLine, setReportLine] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      // Get active borrow transactions for this user, then join lines and items
      const { data: tx } = await supabase
        .from('transactions')
        .select('id')
        .eq('user_id', profile?.id)
        .eq('transaction_type', 'borrow')
        .eq('status', 'active');

      const txIds = (tx || []).map((t) => t.id);
      if (txIds.length === 0) {
        setLines([]);
        setLoading(false);
        return;
      }

      const { data: linesData } = await supabase
        .from('transaction_lines')
        .select('id, transaction_id, item_id, line_status, notes, created_at, items ( item_name, image_url )')
        .in('transaction_id', txIds)
        .eq('line_status', 'active')
        .order('created_at', { ascending: false });

      if (mounted) {
        setLines(linesData || []);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [profile?.id]);

  return (
    <div className="container">
      <header className="row" style={{ alignItems: 'center', marginBottom: '1rem' }}>
        <h2>My Borrowed Items</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
          <Link className="button" to="/student">Back to Dashboard</Link>
          <button className="button" onClick={logout} style={{ borderColor: '#ef4444' }}>
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <div className="card">Loading...</div>
      ) : lines.length === 0 ? (
        <div className="card">You have no borrowed items.</div>
      ) : (
        <div className="row">
          {lines.map((line) => (
            <div className="card" key={line.id} style={{ width: 340 }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <img
                  src={line.items?.image_url || 'https://via.placeholder.com/80x80?text=SCIS'}
                  alt={line.items?.item_name}
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover', borderRadius: 8 }}
                />
                <div>
                  <h4 style={{ margin: 0 }}>{line.items?.item_name}</h4>
                  <p style={{ opacity: 0.75, marginTop: '0.25rem' }}>
                    Borrowed: {new Date(line.created_at).toLocaleString()}
                  </p>
                  <p style={{ opacity: 0.75 }}>{line.notes}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button className="button" onClick={() => setReportLine(line)} style={{ borderColor: '#f59e0b' }}>
                  Report Issue
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {reportLine && (
        <IssueReportForm
          transactionLine={reportLine}
          onClose={() => setReportLine(null)}
          onSubmitted={() => setReportLine(null)}
        />
      )}
    </div>
  );
}
