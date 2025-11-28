import StatusBadge from './StatusBadge';
import type { Item } from '../types/Item';

export default function ItemCard({ item, onBorrow, onReserve }: {
  item: Item;
  onBorrow?: (item: Item) => void;
  onReserve?: (item: Item) => void;
}) {
  return (
    <div className="card">
      <div className="row" style={{ alignItems: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--border)', overflow: 'hidden' }}>
          {item.imageBase64 ? <img src={item.imageBase64} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : null}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>{item.name}</h3>
          <div style={{ color: 'var(--muted)' }}>{item.description}</div>
          <div className="inline" style={{ marginTop: 6 }}>
            <StatusBadge status={item.status} />
            <span className="badge">Qty: {item.quantity}</span>
            <span className="badge">Category: {item.category}</span>
          </div>
        </div>
        <div className="inline">
          <button className="btn" disabled={item.status !== 'available'} onClick={() => onBorrow?.(item)}>Borrow</button>
          <button className="btn secondary" disabled={item.status === 'available'} onClick={() => onReserve?.(item)}>Reserve</button>
        </div>
      </div>
    </div>
  );
}
