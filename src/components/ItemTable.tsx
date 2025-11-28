import type { Item } from '../types/Item';
import StatusBadge from './StatusBadge';

export default function ItemTable({ items, onEdit, onDelete }: {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}) {
  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <th>Name</th><th>Category</th><th>Status</th><th>Qty</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id} style={{ borderTop: '1px solid var(--border)' }}>
              <td>{i.name}</td>
              <td>{i.category}</td>
              <td><StatusBadge status={i.status} /></td>
              <td>{i.quantity}</td>
              <td className="inline">
                <button className="btn" onClick={() => onEdit(i)}>Edit</button>
                <button className="btn secondary" onClick={() => onDelete(i)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
