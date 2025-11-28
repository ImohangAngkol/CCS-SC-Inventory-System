import { useEffect, useState } from 'react';
import { readFiltersFromUrl, writeFiltersToUrl, type InventoryFilters } from '../utils/queryParams';

export default function FilterBar({ onChange }: { onChange: (f: InventoryFilters) => void }) {
  const [filters, setFilters] = useState<InventoryFilters>(() => readFiltersFromUrl());

  useEffect(() => {
    writeFiltersToUrl(filters);
    onChange(filters);
  }, [filters]);

  return (
    <div className="card">
      <div className="row">
        <input
          className="input"
          placeholder="Search name or description"
          value={filters.search ?? ''}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        />
        <select
          className="select"
          value={filters.category ?? 'all'}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value as any }))}
        >
          <option value="all">All categories</option>
          <option value="electronics">Electronics</option>
          <option value="cables">Cables</option>
          <option value="tools">Tools</option>
          <option value="peripherals">Peripherals</option>
          <option value="others">Others</option>
        </select>
        <select
          className="select"
          value={filters.status ?? 'all'}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value as any }))}
        >
          <option value="all">All status</option>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
          <option value="reserved">Reserved</option>
          <option value="damaged">Damaged</option>
        </select>
        <input
          className="input"
          type="number"
          placeholder="Min qty"
          value={filters.minQty ?? ''}
          onChange={e => setFilters(f => ({ ...f, minQty: e.target.value ? Number(e.target.value) : undefined }))}
        />
        <input
          className="input"
          type="number"
          placeholder="Max qty"
          value={filters.maxQty ?? ''}
          onChange={e => setFilters(f => ({ ...f, maxQty: e.target.value ? Number(e.target.value) : undefined }))}
        />
      </div>
    </div>
  );
}
