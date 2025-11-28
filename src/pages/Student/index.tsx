import { useEffect, useState } from 'react';
import { mockApi } from '../../utils/mockApi';
import ItemCard from '../../components/ItemCard';
import FilterBar from '../../components/FilterBar';
import { toastError, toastSuccess } from '../../utils/toast';
import type { Item } from '../../types/Item';
import type { InventoryFilters } from '../../utils/queryParams';

export default function StudentDashboard() {
  const [items, setItems] = useState<Item[]>([]);

  const refresh = (filters?: InventoryFilters) => {
    setItems(mockApi.getItems({
      search: filters?.search,
      category: filters?.category,
      status: filters?.status,
      minQty: filters?.minQty,
      maxQty: filters?.maxQty
    }));
  };

  useEffect(() => { refresh(); }, []);

  const handleBorrow = (item: Item) => {
    try {
      mockApi.borrowItem('student-mock', item.id, 1);
      toastSuccess('Borrowed', `You borrowed ${item.name}`);
      refresh();
    } catch (e: any) {
      toastError('Borrow failed', e?.message);
    }
  };

  const handleReserve = (item: Item) => {
    try {
      mockApi.reserveItem('student-mock', item.id, 1);
      toastSuccess('Reserved', `Reservation for ${item.name} submitted`);
      refresh();
    } catch (e: any) {
      toastError('Reserve failed', e?.message);
    }
  };

  return (
    <div className="container">
      <h2>Student dashboard</h2>
      <FilterBar onChange={refresh} />
      <div className="grid">
        {items.map(i => <ItemCard key={i.id} item={i} onBorrow={handleBorrow} onReserve={handleReserve} />)}
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h3>Report issue</h3>
        <p>Mock: Submit an issue with item ID and notes. Toast will confirm.</p>
        <button className="btn secondary" onClick={() => toastSuccess('Issue reported', 'Thanks for the report!')}>Report sample issue</button>
      </div>
    </div>
  );
}
