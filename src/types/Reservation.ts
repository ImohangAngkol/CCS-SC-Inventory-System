export type ReservationStatus = 'pending' | 'approved' | 'rejected';

export interface Reservation {
  id: string;
  itemId: string;
  userId: string;
  quantity: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}
