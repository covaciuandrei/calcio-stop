import { Badge } from '../badges/badge';
import { KitType } from '../kittypes/kittype';
import { Nameset } from '../namesets/nameset';
import { Team } from '../teams/team';

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
  nameset?: Nameset | null; // full nameset object (fetched in same request)
  team?: Team | null; // full team object (fetched in same request)
  kitType?: KitType | null; // full kit type object (fetched in same request)
  badge?: Badge | null; // full badge object (fetched in same request)
}
