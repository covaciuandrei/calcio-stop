export enum OrderStatus {
  TO_ORDER = 'to order',
  ORDERED = 'ordered',
  RECEIVED = 'received',
  MESSAGE_SENT = 'message sent',
  FINISHED = 'finished',
}

export interface Order {
  id: string;
  name: string;
  type: string; // Product type
  sizes: Array<{
    size: string;
    quantity: number;
  }>;
  namesetId: string | null;
  teamId: string | null;
  kitTypeId: string;
  badgeId: string | null;
  price: number;
  status: OrderStatus;
  customerName?: string; // Can be empty
  phoneNumber?: string; // Can be empty
  createdAt: string;
}
