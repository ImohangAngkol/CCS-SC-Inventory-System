// src/components/ItemForm.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ItemForm({ initialItem, onSaved, onCancel }) {
  const [item, setItem] = useState(
    initialItem || {
      item_name: '',
      description: '',
      current_quantity: 1,
      image_url: '',
      status: 'available',
    }
  );
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  async function uploadImageIfAny() {
    if (!file) return item.image_url || null;
    const ext = file.name.split('.').pop();
    const fileName = `item-${item.item_name}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('scis-files').upload(fileName, file, { upsert: true });
    if (error) throw error;
    const { data: publicUrl } = supabase.storage.from('scis-files').getPublicUrl(fileName);
    return publicUrl?.publicUrl || null;
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const imageUrl = await uploadImageIfAny();
      const payload = { ...item, image_url: imageUrl };

      if (initialItem?.id) {
        const { error } = await supabase.from('items').update(payload).eq('id', initialItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('items').insert(payload);
        if (error) throw error;
      }
      onSaved?.();
    } catch (err) {
      console.error(err);
      alert('Failed to save item.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="card" style={{ marginTop: '1rem' }}>
      <div className="row">
        <div style={{ flex: 1 }}>
          <label>Name</label>
          <input
            className="input"
            value={item.item_name}
            onChange={(e) => setItem({ ...item, item_name: e.target.value })}
          />
        </div>
        <div style={{ width: 180 }}>
          <label>Quantity</label>
          <input
            className="input"
            type="number"
            min={0}
            value={item.current_quantity}
            onChange={(e) => setItem({ ...item, current_quantity: Number(e.target.value) })}
          />
        </div>
        <div style={{ width: 220 }}>
          <label>Status</label>
          <select
            className="select"
            value={item.status}
            onChange={(e) => setItem({ ...item, status: e.target.value })}
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="reserved">Reserved</option>
            <option value="damaged">Damaged</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <label>Description</label>
        <textarea
          className="input"
          rows={3}
          value={item.description}
          onChange={(e) => setItem({ ...item, description: e.target.value })}
        />
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <label>Image</label>
        <div className="row">
          <input
            className="input"
            value={item.image_url}
            onChange={(e) => setItem({ ...item, image_url: e.target.value })}
            placeholder="Use existing URL or upload a file"
          />
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button className="button" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button className="button" type="button" onClick={onCancel} style={{ borderColor: '#64748b' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
