export type TxType = "borrow" | "reserve" | "return" | "report";

export interface Transaction {
  id: string;
  userId: string;
  itemId: string;
  type: TxType;
  status: "pending" | "approved" | "denied" | "closed";
  notes?: string;
  date: string; // ISO
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "TX-001", userId: "USR-001", itemId: "ITM-002", type: "borrow", status: "approved", notes: "Event rehearsal", date: "2025-11-15T09:00:00Z" },
  { id: "TX-002", userId: "USR-001", itemId: "ITM-007", type: "borrow", status: "pending", notes: "Club meeting", date: "2025-11-16T13:00:00Z" },
  { id: "TX-003", userId: "USR-002", itemId: "ITM-003", type: "reserve", status: "approved", notes: "Dept orientation", date: "2025-11-14T08:00:00Z" },
  { id: "TX-004", userId: "USR-003", itemId: "ITM-005", type: "report", status: "closed", notes: "Damage noted", date: "2025-11-10T14:00:00Z" },
];
