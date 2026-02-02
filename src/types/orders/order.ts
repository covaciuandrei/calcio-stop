// No imports to avoid circular dependencies

export enum OrderStatus {
    TO_ORDER = 'to order',
    ORDERED = 'ordered',
    RECEIVED = 'received',
    MESSAGE_SENT = 'message sent',
    FINISHED = 'finished',
}

// Order item - similar to SaleItem
export interface OrderItem {
    productId: string;
    size: string;
    quantity: number;
    price: number; // Price per unit
    product?: {
        id: string;
        name: string;
        team?: { id: string; name: string } | null;
        kitType?: { id: string; name: string } | null;
        [key: string]: unknown;
    } | null; // Resolved product for display
}

export interface Order {
    id: string;
    items: OrderItem[]; // Multiple products per order
    status: OrderStatus;
    saleType: 'OLX' | 'IN-PERSON' | 'VINTED'; // Same as SaleType but inline to avoid circular deps
    customerName?: string;
    phoneNumber?: string;
    createdAt: string;
    archivedAt?: string;
    finishedAt?: string;
    saleId?: string; // Reference to auto-created sale
}

// Status transition rules
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.TO_ORDER]: [OrderStatus.ORDERED],
    [OrderStatus.ORDERED]: [OrderStatus.TO_ORDER, OrderStatus.RECEIVED],
    [OrderStatus.RECEIVED]: [OrderStatus.ORDERED, OrderStatus.MESSAGE_SENT],
    [OrderStatus.MESSAGE_SENT]: [OrderStatus.FINISHED],
    [OrderStatus.FINISHED]: [], // Locked
};

// Validation helper
export function canFinishOrder(order: Order): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!order.customerName?.trim()) {
        errors.push('Customer name is required');
    }
    if (!order.phoneNumber?.trim()) {
        errors.push('Phone number is required');
    }
    if (!order.items || order.items.length === 0) {
        errors.push('At least one item is required');
    }
    const hasValidItems = order.items?.some(item => item.productId && item.quantity > 0);
    if (!hasValidItems) {
        errors.push('At least one item with product and quantity is required');
    }

    return { valid: errors.length === 0, errors };
}
