// Inventory log entity types
export type InventoryChangeType =
  | 'sale'
  | 'sale_edit'
  | 'sale_reversal'
  | 'return'
  | 'return_reversal'
  | 'manual_adjustment'
  | 'initial_stock'
  | 'restock';

export type InventoryEntityType = 'product' | 'nameset' | 'badge';

export type InventoryReferenceType = 'sale' | 'return' | 'reservation' | 'product';

// Main inventory log interface
export interface InventoryLog {
  id: string;
  entityType: InventoryEntityType;
  entityId: string;
  entityName: string;
  size?: string; // Only for products with sizes
  changeType: InventoryChangeType;
  quantityBefore: number;
  quantityChange: number; // Positive = increase, Negative = decrease
  quantityAfter: number;
  reason?: string;
  referenceId?: string;
  referenceType?: InventoryReferenceType;
  createdAt: string;
}

// Input type for creating a log entry
export interface CreateInventoryLogInput {
  entityType: InventoryEntityType;
  entityId: string;
  entityName: string;
  size?: string;
  changeType: InventoryChangeType;
  quantityBefore: number;
  quantityChange: number;
  quantityAfter: number;
  reason?: string;
  referenceId?: string;
  referenceType?: InventoryReferenceType;
}

// Filters for querying inventory logs
export interface InventoryLogFilters {
  entityType?: InventoryEntityType;
  entityId?: string;
  changeType?: InventoryChangeType;
  startDate?: string;
  endDate?: string;
  limit?: number;
}
