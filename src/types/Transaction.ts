export interface Transaction {
  id: string;
  userId: string;
  itemId: string;
  type: 'borrow' | 'return' | 'issue';
  notes?: string;
  createdAt: string;
  resolvedAt?: string;
  status: 'open' | 'closed';
}
