export type ItemStatus = 'available' | 'borrowed' | 'reserved' | 'damaged';

export interface Item {
  id: string;
  name: string;
  description: string;
  category: 'electronics' | 'cables' | 'tools' | 'peripherals' | 'others';
  quantity: number;
  status: ItemStatus;
  imageBase64?: string;
  createdAt: string;
  updatedAt: string;
}
