// src/components/IssueReportForm.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function IssueReportForm({ transactionLine, onClose, onSubmitted }) {
  const { profile } = useAuth();
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('low');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function uploadImage() {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `issue-${transactionLine.id}-${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('scis-files').upload(fileName, file, {
      upsert: true,
    });
    if (error) throw error;
    const { data: publicUrl } = supabase.storage.from('scis-files').getPublicUrl(fileName);
    return publicUrl?.publicUrl || null;
  }

  async function submit(e) {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please describe the issue.');
      return;
    }
    setSubmitting(true);
    try {
      const imageUrl = await uploadImage();
      const { error } = await supabase.from('issue_reports').insert({
        transaction_id: transactionLine.transaction_id,
        reporter_id: profile?.id,
        item_id: transactionLine.item_id,
        description,
        severity,
        image_url: imageUrl,
        status: 'open',
        report_date: new Date().toISOString(),
      });
      if (error) throw error;
      onSubmitted?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert('Failed to submit report.');
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
    >
      <div className="card" style={{ width: '560px' }}>
        <h3>Report Issue</h3>
        <form onSubmit={submit}>
          <p style={{ opacity: 0.8 }}>
            Item ID: {transactionLine.item_id} | Transaction: {transactionLine.transaction_id}
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <label>Description</label>
            <textarea
              className="input"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the damage/malfunction..."
            />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <label>Severity</label>
            <select className="select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <label>Attach Image (optional)</label>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="button" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
            <button className="button" type="button" onClick={onClose} style={{ borderColor: '#64748b' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
