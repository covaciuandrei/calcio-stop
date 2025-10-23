/**
 * @jest-environment jsdom
 */

import 'jest-localstorage-mock';
import { useSalesStore } from '../stores/salesStore';
import { Sale } from '../types';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Sales Store CRUD Operations', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset store state
    useSalesStore.setState({
      sales: [],
    });
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('CREATE Operations', () => {
    test('should add a new sale to the store', () => {
      const newSale: Sale = {
        id: 'sale-1',
        productId: 'product-1',
        size: 'M',
        quantity: 2,
        priceSold: 89.99,
        customerName: 'John Doe',
        date: '2024-01-15',
        createdAt: '2024-01-15T10:30:00.000Z',
      };

      const { addSale } = useSalesStore.getState();
      addSale(newSale);

      const state = useSalesStore.getState();
      expect(state.sales).toHaveLength(1);
      expect(state.sales[0]).toEqual(newSale);
    });

    test('should add multiple sales without duplicates', () => {
      const sale1: Sale = {
        id: 'sale-1',
        productId: 'product-1',
        size: 'M',
        quantity: 1,
        priceSold: 89.99,
        customerName: 'John Doe',
        date: '2024-01-15',
        createdAt: '2024-01-15T10:30:00.000Z',
      };

      const sale2: Sale = {
        id: 'sale-2',
        productId: 'product-2',
        size: 'L',
        quantity: 1,
        priceSold: 79.99,
        customerName: 'Jane Smith',
        date: '2024-01-16',
        createdAt: '2024-01-16T14:20:00.000Z',
      };

      const { addSale } = useSalesStore.getState();
      addSale(sale1);
      addSale(sale2);

      const state = useSalesStore.getState();
      expect(state.sales).toHaveLength(2);
      expect(state.sales).toContainEqual(sale1);
      expect(state.sales).toContainEqual(sale2);
    });
  });

  describe('READ Operations', () => {
    test('should return all sales', () => {
      const sales: Sale[] = [
        {
          id: 'sale-1',
          productId: 'product-1',
          size: 'M',
          quantity: 1,
          priceSold: 89.99,
          customerName: 'John Doe',
          date: '2024-01-15',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
        {
          id: 'sale-2',
          productId: 'product-2',
          size: 'L',
          quantity: 2,
          priceSold: 79.99,
          customerName: 'Jane Smith',
          date: '2024-01-16',
          createdAt: '2024-01-16T14:20:00.000Z',
        },
      ];

      useSalesStore.setState({ sales });

      const state = useSalesStore.getState();
      expect(state.sales).toEqual(sales);
    });
  });

  describe('UPDATE Operations', () => {
    test('should update an existing sale', () => {
      const originalSale: Sale = {
        id: 'sale-1',
        productId: 'product-1',
        size: 'M',
        quantity: 1,
        priceSold: 89.99,
        customerName: 'John Doe',
        date: '2024-01-15',
        createdAt: '2024-01-15T10:30:00.000Z',
      };

      useSalesStore.setState({ sales: [originalSale] });

      const { updateSale } = useSalesStore.getState();
      updateSale('sale-1', { 
        quantity: 2,
        priceSold: 79.99,
        customerName: 'John Smith'
      });

      const state = useSalesStore.getState();
      expect(state.sales[0].quantity).toBe(2);
      expect(state.sales[0].priceSold).toBe(79.99);
      expect(state.sales[0].customerName).toBe('John Smith');
      expect(state.sales[0].id).toBe('sale-1');
      expect(state.sales[0].createdAt).toBe(originalSale.createdAt);
    });

    test('should update sale date and product', () => {
      const originalSale: Sale = {
        id: 'sale-1',
        productId: 'product-1',
        size: 'M',
        quantity: 1,
        priceSold: 89.99,
        customerName: 'John Doe',
        date: '2024-01-15',
        createdAt: '2024-01-15T10:30:00.000Z',
      };

      useSalesStore.setState({ sales: [originalSale] });

      const { updateSale } = useSalesStore.getState();
      updateSale('sale-1', { 
        productId: 'product-2',
        size: 'L',
        date: '2024-01-20'
      });

      const state = useSalesStore.getState();
      expect(state.sales[0].productId).toBe('product-2');
      expect(state.sales[0].size).toBe('L');
      expect(state.sales[0].date).toBe('2024-01-20');
    });

    test('should not update non-existent sale', () => {
      const originalSale: Sale = {
        id: 'sale-1',
        productId: 'product-1',
        size: 'M',
        quantity: 1,
        priceSold: 89.99,
        customerName: 'John Doe',
        date: '2024-01-15',
        createdAt: '2024-01-15T10:30:00.000Z',
      };

      useSalesStore.setState({ sales: [originalSale] });

      const { updateSale } = useSalesStore.getState();
      updateSale('non-existent', { quantity: 5 });

      const state = useSalesStore.getState();
      expect(state.sales[0]).toEqual(originalSale);
    });
  });

  describe('DELETE Operations', () => {
    test('should delete a sale from the store', () => {
      const sales: Sale[] = [
        {
          id: 'sale-1',
          productId: 'product-1',
          size: 'M',
          quantity: 1,
          priceSold: 89.99,
          customerName: 'John Doe',
          date: '2024-01-15',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
        {
          id: 'sale-2',
          productId: 'product-2',
          size: 'L',
          quantity: 2,
          priceSold: 79.99,
          customerName: 'Jane Smith',
          date: '2024-01-16',
          createdAt: '2024-01-16T14:20:00.000Z',
        },
      ];

      useSalesStore.setState({ sales });

      const { deleteSale } = useSalesStore.getState();
      deleteSale('sale-1');

      const state = useSalesStore.getState();
      expect(state.sales).toHaveLength(1);
      expect(state.sales[0].id).toBe('sale-2');
    });

    test('should delete all sales when clearing store', () => {
      const sales: Sale[] = [
        {
          id: 'sale-1',
          productId: 'product-1',
          size: 'M',
          quantity: 1,
          priceSold: 89.99,
          customerName: 'John Doe',
          date: '2024-01-15',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
        {
          id: 'sale-2',
          productId: 'product-2',
          size: 'L',
          quantity: 2,
          priceSold: 79.99,
          customerName: 'Jane Smith',
          date: '2024-01-16',
          createdAt: '2024-01-16T14:20:00.000Z',
        },
      ];

      useSalesStore.setState({ sales });

      const { setSales } = useSalesStore.getState();
      setSales([]);

      const state = useSalesStore.getState();
      expect(state.sales).toHaveLength(0);
    });
  });

  describe('SET Operations', () => {
    test('should set sales array', () => {
      const newSales: Sale[] = [
        {
          id: 'sale-1',
          productId: 'product-1',
          size: 'M',
          quantity: 1,
          priceSold: 89.99,
          customerName: 'John Doe',
          date: '2024-01-15',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
        {
          id: 'sale-2',
          productId: 'product-2',
          size: 'L',
          quantity: 2,
          priceSold: 79.99,
          customerName: 'Jane Smith',
          date: '2024-01-16',
          createdAt: '2024-01-16T14:20:00.000Z',
        },
      ];

      const { setSales } = useSalesStore.getState();
      setSales(newSales);

      const state = useSalesStore.getState();
      expect(state.sales).toEqual(newSales);
    });
  });

  describe('Data Integrity', () => {
    test('should maintain data consistency during operations', () => {
      const sale: Sale = {
        id: 'sale-1',
        productId: 'product-1',
        size: 'M',
        quantity: 1,
        priceSold: 89.99,
        customerName: 'John Doe',
        date: '2024-01-15',
        createdAt: '2024-01-15T10:30:00.000Z',
      };

      const { addSale, updateSale, deleteSale } = useSalesStore.getState();
      
      // Add sale
      addSale(sale);
      expect(useSalesStore.getState().sales).toHaveLength(1);
      
      // Update sale
      updateSale('sale-1', { quantity: 3 });
      expect(useSalesStore.getState().sales[0].quantity).toBe(3);
      
      // Delete sale
      deleteSale('sale-1');
      expect(useSalesStore.getState().sales).toHaveLength(0);
    });

    test('should handle complex sale data correctly', () => {
      const complexSale: Sale = {
        id: 'sale-1',
        productId: 'product-real-madrid-messi',
        size: 'L',
        quantity: 2,
        priceSold: 129.99,
        customerName: 'Lionel Messi Fan',
        date: '2024-01-15',
        createdAt: '2024-01-15T10:30:00.000Z',
      };

      const { addSale, updateSale } = useSalesStore.getState();
      
      addSale(complexSale);
      expect(useSalesStore.getState().sales[0]).toEqual(complexSale);
      
      // Update with new customer and price
      updateSale('sale-1', {
        customerName: 'Cristiano Ronaldo Fan',
        priceSold: 149.99,
        quantity: 1
      });
      
      const updatedSale = useSalesStore.getState().sales[0];
      expect(updatedSale.customerName).toBe('Cristiano Ronaldo Fan');
      expect(updatedSale.priceSold).toBe(149.99);
      expect(updatedSale.quantity).toBe(1);
    });

    test('should handle multiple sales for same product', () => {
      const sale1: Sale = {
        id: 'sale-1',
        productId: 'product-1',
        size: 'M',
        quantity: 1,
        priceSold: 89.99,
        customerName: 'Customer A',
        date: '2024-01-15',
        createdAt: '2024-01-15T10:30:00.000Z',
      };

      const sale2: Sale = {
        id: 'sale-2',
        productId: 'product-1',
        size: 'L',
        quantity: 2,
        priceSold: 89.99,
        customerName: 'Customer B',
        date: '2024-01-16',
        createdAt: '2024-01-16T14:20:00.000Z',
      };

      const { addSale } = useSalesStore.getState();
      
      addSale(sale1);
      addSale(sale2);
      
      const state = useSalesStore.getState();
      expect(state.sales).toHaveLength(2);
      expect(state.sales.every(sale => sale.productId === 'product-1')).toBe(true);
    });
  });
});

