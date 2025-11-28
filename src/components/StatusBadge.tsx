import type { ItemStatus } from '../types/Item';

const colors: Record<ItemStatus, string> = {
  available: 'linear-gradient(90deg,#16a34a,#22c55e)',
  borrowed: 'linear-gradient(90deg,#2563eb,#1e3a8a)',
  reserved: 'linear-gradient(90deg,#f59e0b,#d97706)',
  damaged: 'linear-gradient(90deg,#ef4444,#b91c1c)'
};

export default function StatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span className="badge" style={{ backgroundImage: colors[status], color: 'white', border: 'none' }}>
      {status.toUpperCase()}
    </span>
  );
}
