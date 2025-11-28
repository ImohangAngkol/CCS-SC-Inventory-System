export interface InventoryFilters {
  search?: string;
  category?: 'electronics' | 'cables' | 'tools' | 'peripherals' | 'others' | 'all';
  status?: 'available' | 'borrowed' | 'reserved' | 'damaged' | 'all';
  minQty?: number;
  maxQty?: number;
}

export const readFiltersFromUrl = (): InventoryFilters => {
  const p = new URLSearchParams(window.location.search);
  const minQty = p.get('minQty');
  const maxQty = p.get('maxQty');
  return {
    search: p.get('search') ?? '',
    category: (p.get('category') as InventoryFilters['category']) ?? 'all',
    status: (p.get('status') as InventoryFilters['status']) ?? 'all',
    minQty: minQty ? Number(minQty) : undefined,
    maxQty: maxQty ? Number(maxQty) : undefined
  };
};

export const writeFiltersToUrl = (filters: InventoryFilters) => {
  const p = new URLSearchParams();
  if (filters.search) p.set('search', filters.search);
  if (filters.category && filters.category !== 'all') p.set('category', filters.category);
  if (filters.status && filters.status !== 'all') p.set('status', filters.status);
  if (filters.minQty !== undefined) p.set('minQty', String(filters.minQty));
  if (filters.maxQty !== undefined) p.set('maxQty', String(filters.maxQty));
  const url = `${window.location.pathname}?${p.toString()}`;
  history.replaceState(null, '', url);
};
