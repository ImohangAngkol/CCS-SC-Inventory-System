import { useEffect, useState } from 'react';
import ItemTable from '../../components/ItemTable';
import { mockApi } from '../../utils/mockApi';
import { toastError, toastSuccess, toastInfo } from '../../utils/toast';
import '../../styles/forms.css';
import type { Item } from '../../types/Item';
import type { Reservation } from '../../types/Reservation';

export default function OfficerDashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Partial<Item>>({ name: '', description: '', category: 'electronics', quantity: 1, status: 'available' });
  const [editing, setEditing] = useState<Item | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  // optional: users state removed because it's unused in this component

  const refresh = () => {
    setItems(mockApi.getItems());
    setReservations(mockApi.getReservations('pending'));
  };

  useEffect(() => { refresh(); }, []);

  const validate = () => {
    if (!form.name) return 'Name is required';
    if (!form.description) return 'Description is required';
    if (!form.category) return 'Category is required';
    if (form.quantity === undefined || form.quantity < 0) return 'Quantity must be 0 or more';
    if (!form.status) return 'Status is required';
    return null;
  };

  const submit = () => {
    const err = validate();
    if (err) return toastError('Validation error', err);
    try {
      if (editing) {
        const updated = mockApi.updateItem(editing.id, form);
        toastSuccess('Item updated', updated.name);
        setEditing(null);
      } else {
        const created = mockApi.addItem(form as any);
        toastSuccess('Item added', created.name);
      }
      setForm({ name: '', description: '', category: 'electronics', quantity: 1, status: 'available' });
      refresh();
    } catch (e: any) {
      toastError('Save failed', e?.message);
    }
  };

  const onEdit = (i: Item) => {
    setEditing(i);
    setForm(i);
  };

  const onDelete = (i: Item) => {
    try {
      mockApi.deleteItem(i.id);
      toastSuccess('Item deleted', i.name);
      refresh();
    } catch (e: any) {
      toastError('Delete failed', e?.message);
    }
  };

  const approve = (id: string) => {
    try {
      mockApi.approveReservation(id);
      toastSuccess('Reservation approved');
      refresh();
    } catch (e: any) {
      toastError('Approval failed', e?.message);
    }
  };

  const reject = (id: string) => {
    try {
      mockApi.rejectReservation(id);
      toastSuccess('Reservation rejected');
      refresh();
    } catch (e: any) {
      toastError('Reject failed', e?.message);
    }
  };

  const recentReturns = mockApi.getRecentReturns();

  return (
    <div className="container">
      <h2>Officer dashboard</h2>

      <div className="card">
        <h3>{editing ? 'Edit item' : 'Add item'}</h3>
        <div className="row">
          <div className="form-field"><label className="required">Name</label>
            <input className="input" value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-field"><label className="required">Description</label>
            <input className="input" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-field"><label className="required">Category</label>
            <select className="select" value={form.category ?? 'electronics'} onChange={e => setForm(f => ({ ...f, category: e.target.value as any }))}>
              <option value="electronics">Electronics</option>
              <option value="cables">Cables</option>
              <option value="tools">Tools</option>
              <option value="peripherals">Peripherals</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className="form-field"><label className="required">Status</label>
            <select className="select" value={form.status ?? 'available'} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
              <option value="reserved">Reserved</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>
          <div className="form-field"><label className="required">Quantity</label>
            <input className="input" type="number" value={form.quantity ?? 0} onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))} />
          </div>
          <div className="form-field"><label>Image (base64)</label>
            <input className="input" type="file" accept="image/*"
              onChange={async e => {
                const file = e.target.files?.[0];
                if (!file) return;
                const b64 = await fileToBase64(file);
                setForm(f => ({ ...f, imageBase64: b64 }));
              }} />
          </div>
        </div>
        <div className="inline">
          <button className="btn" onClick={submit}>{editing ? 'Update' : 'Add'}</button>
          {editing && <button className="btn secondary" onClick={() => { setEditing(null); setForm({ name: '', description: '', category: 'electronics', quantity: 1, status: 'available' }); }}>Cancel</button>}
        </div>
      </div>

      <ItemTable items={items} onEdit={onEdit} onDelete={onDelete} />

      <div className="row" style={{ marginTop: '1rem' }}>
        <div className="card" style={{ flex: 1 }}>
          <h3>Pending reservations</h3>
          {reservations.length === 0 && <p>No pending reservations.</p>}
          {reservations.map(r => (
            <div key={r.id} className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div><strong>ID:</strong> {r.id}</div>
                <div><strong>Item:</strong> {r.itemId}</div>
                <div><strong>Qty:</strong> {r.quantity}</div>
              </div>
              <div className="inline">
                <button className="btn" onClick={() => approve(r.id)}>Approve</button>
                <button className="btn secondary" onClick={() => reject(r.id)}>Reject</button>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ flex: 1 }}>
          <h3>Recently returned items</h3>
          {recentReturns.length === 0 && <p>No returns yet.</p>}
          {recentReturns.map(ret => (
            <div key={ret.id} className="row" style={{ justifyContent: 'space-between' }}>
              <div><strong>Item:</strong> {ret.itemId}</div>
              <div><strong>Status:</strong> {ret.status}</div>
              <div><strong>By:</strong> {ret.userId}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h3>User management</h3>
        <p>Mock example: Add/edit/deactivate users with inline validation</p>
        <button className="btn secondary" onClick={() => toastInfo('User module placeholder', 'Implement full UI bound to mockApi.registerUser/updateUser/deactivateUser')}>
          Show placeholder toast
        </button>
      </div>
    </div>
  );
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
