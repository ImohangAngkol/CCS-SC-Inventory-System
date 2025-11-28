import LS from './localStorage';
import type { Item } from '../types/Item';
import type { Reservation } from '../types/Reservation';
import type { User } from '../types/User';

type DB = {
  items: Item[];
  reservations: Reservation[];
  users: User[];
  returns: { id: string; itemId: string; userId: string; createdAt: string; status: 'damaged' | 'ok' }[];
};

const KEY = 'scis_db';

const seedItems: Item[] = [
  {
    id: 'item-laptop-1',
    name: 'Council Laptop A',
    description: 'i5, 8GB RAM, 256GB SSD',
    category: 'electronics',
    quantity: 3,
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'item-cable-1',
    name: 'HDMI Cable',
    description: '2m high-speed',
    category: 'cables',
    quantity: 10,
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initial: DB = { items: seedItems, reservations: [], users: [], returns: [] };

function load(): DB {
  return LS.get<DB>(KEY, initial);
}
function save(db: DB) {
  LS.set(KEY, db);
}

function matchesFilters(item: Item, filters?: { category?: string; status?: string; search?: string; minQty?: number; maxQty?: number }) {
  if (!filters) return true;
  const { category, status, search, minQty, maxQty } = filters;
  if (category && category !== 'all' && item.category !== category) return false;
  if (status && status !== 'all' && item.status !== status) return false;
  if (search) {
    const s = search.toLowerCase();
    if (!item.name.toLowerCase().includes(s) && !item.description.toLowerCase().includes(s)) return false;
  }
  if (minQty !== undefined && item.quantity < minQty) return false;
  if (maxQty !== undefined && item.quantity > maxQty) return false;
  return true;
}

export const mockApi = {
  // Items
  getItems(filters?: { category?: string; status?: string; search?: string; minQty?: number; maxQty?: number }): Item[] {
    const db = load();
    return db.items.filter(i => matchesFilters(i, filters));
  },
  getItemById(id: string): Item | undefined {
    const db = load();
    return db.items.find(i => i.id === id);
  },
  addItem(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Item {
    const db = load();
    const exists = db.items.some(i => i.name.toLowerCase() === item.name.toLowerCase());
    if (exists) throw { message: 'Item already exists' };
    const newItem: Item = { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    db.items.push(newItem);
    save(db);
    return newItem;
  },
  updateItem(id: string, fields: Partial<Item>): Item {
    const db = load();
    const idx = db.items.findIndex(i => i.id === id);
    if (idx < 0) throw { message: 'Item not found' };
    const updated = { ...db.items[idx], ...fields, updatedAt: new Date().toISOString() };
    db.items[idx] = updated;
    save(db);
    return updated;
  },
  deleteItem(id: string) {
    const db = load();
    const idx = db.items.findIndex(i => i.id === id);
    if (idx < 0) throw { message: 'Item not found' };
    db.items.splice(idx, 1);
    save(db);
  },

  // Reservations
  reserveItem(userId: string, itemId: string, quantity: number): Reservation {
    const db = load();
    const item = db.items.find(i => i.id === itemId);
    if (!item) throw { message: 'Item not found' };
    if (item.status !== 'available' || item.quantity < quantity) throw { message: 'Item unavailable for reservation' };
    const reservation: Reservation = {
      id: crypto.randomUUID(),
      itemId,
      userId,
      quantity,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.reservations.push(reservation);
    // Mark reserved state if fully reserved
    item.status = 'reserved';
    save(db);
    return reservation;
  },
  approveReservation(id: string) {
    const db = load();
    const res = db.reservations.find(r => r.id === id);
    if (!res) throw { message: 'Reservation not found' };
    res.status = 'approved';
    res.updatedAt = new Date().toISOString();
    const item = db.items.find(i => i.id === res.itemId);
    if (!item) throw { message: 'Item not found' };
    item.quantity = Math.max(0, item.quantity - res.quantity);
    item.status = item.quantity > 0 ? 'available' : 'borrowed';
    save(db);
    return res;
  },
  rejectReservation(id: string) {
    const db = load();
    const res = db.reservations.find(r => r.id === id);
    if (!res) throw { message: 'Reservation not found' };
    res.status = 'rejected';
    res.updatedAt = new Date().toISOString();
    const item = db.items.find(i => i.id === res.itemId);
    if (item) item.status = item.quantity > 0 ? 'available' : item.status;
    save(db);
    return res;
  },
  getReservations(status?: Reservation['status']): Reservation[] {
    const db = load();
    return db.reservations.filter(r => (status ? r.status === status : true));
  },

  // Users
  registerUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'status'>): User {
    const db = load();
    const exists = db.users.some(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (exists) throw { message: 'User already exists' };
    const newUser: User = { ...user, id: crypto.randomUUID(), status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    db.users.push(newUser);
    save(db);
    return newUser;
  },
  updateUser(id: string, fields: Partial<User>): User {
    const db = load();
    const idx = db.users.findIndex(u => u.id === id);
    if (idx < 0) throw { message: 'User not found' };
    const updated = { ...db.users[idx], ...fields, updatedAt: new Date().toISOString() };
    db.users[idx] = updated;
    save(db);
    return updated;
  },
  deactivateUser(id: string) {
    const db = load();
    const user = db.users.find(u => u.id === id);
    if (!user) throw { message: 'User not found' };
    user.status = 'inactive';
    user.updatedAt = new Date().toISOString();
    save(db);
  },

  // Borrowing & Returns (simple mock)
  borrowItem(_userId: string, itemId: string, quantity: number) {
    const db = load();
    const item = db.items.find(i => i.id === itemId);
    if (!item) throw { message: 'Item not found' };
    if (item.status === 'damaged') throw { message: 'Item damaged' };
    if (item.quantity < quantity) throw { message: 'Insufficient quantity' };
    item.quantity -= quantity;
    item.status = item.quantity === 0 ? 'borrowed' : 'available';
    save(db);
    return { ok: true };
  },
  returnItem(userId: string, itemId: string, condition: 'ok' | 'damaged') {
    const db = load();
    const item = db.items.find(i => i.id === itemId);
    if (!item) throw { message: 'Item not found' };
    db.returns.push({ id: crypto.randomUUID(), itemId, userId, createdAt: new Date().toISOString(), status: condition });
    if (condition === 'ok') {
      item.quantity += 1;
      item.status = 'available';
    } else {
      item.status = 'damaged';
    }
    save(db);
  },
  getRecentReturns() {
    const db = load();
    return db.returns.slice(-10).reverse();
  }
};
