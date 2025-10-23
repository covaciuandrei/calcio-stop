/**
 * @jest-environment jsdom
 */

import 'jest-localstorage-mock';
import { useProductsStore } from '../stores/productsStore';
import { Product, ProductType } from '../types';

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

describe('Products Store CRUD Operations', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset store state
    useProductsStore.setState({
      products: [],
      archivedProducts: [],
    });
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('CREATE Operations', () => {
    test('should add a new product to the store', () => {
      const newProduct: Product = {
        id: 'product-1',
        name: 'Real Madrid Home Kit',
        type: ProductType.SHIRT,
        sizes: [
          { size: 'M', quantity: 10 },
          { size: 'L', quantity: 15 },
        ],
        namesetId: 'nameset-1',
        teamId: 'team-1',
        kitTypeId: 'kit-type-1',
        badgeId: 'badge-1',
        price: 89.99,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addProduct } = useProductsStore.getState();
      addProduct(newProduct);

      const state = useProductsStore.getState();
      expect(state.products).toHaveLength(1);
      expect(state.products[0]).toEqual(newProduct);
    });

    test('should add multiple products without duplicates', () => {
      const product1: Product = {
        id: 'product-1',
        name: 'Real Madrid Home Kit',
        type: ProductType.SHIRT,
        sizes: [{ size: 'M', quantity: 10 }],
        namesetId: null,
        teamId: 'team-1',
        kitTypeId: 'kit-type-1',
        badgeId: null,
        price: 89.99,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const product2: Product = {
        id: 'product-2',
        name: 'Barcelona Away Kit',
        type: ProductType.SHIRT,
        sizes: [{ size: 'L', quantity: 5 }],
        namesetId: null,
        teamId: 'team-2',
        kitTypeId: 'kit-type-1',
        badgeId: null,
        price: 79.99,
        createdAt: '2024-01-02T00:00:00.000Z',
      };

      const { addProduct } = useProductsStore.getState();
      addProduct(product1);
      addProduct(product2);

      const state = useProductsStore.getState();
      expect(state.products).toHaveLength(2);
      expect(state.products).toContainEqual(product1);
      expect(state.products).toContainEqual(product2);
    });
  });

  describe('READ Operations', () => {
    test('should return all products', () => {
      const products: Product[] = [
        {
          id: 'product-1',
          name: 'Real Madrid Home Kit',
          type: ProductType.SHIRT,
          sizes: [{ size: 'M', quantity: 10 }],
          namesetId: null,
          teamId: 'team-1',
          kitTypeId: 'kit-type-1',
          badgeId: null,
          price: 89.99,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'product-2',
          name: 'Barcelona Away Kit',
          type: ProductType.SHIRT,
          sizes: [{ size: 'L', quantity: 5 }],
          namesetId: null,
          teamId: 'team-2',
          kitTypeId: 'kit-type-1',
          badgeId: null,
          price: 79.99,
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      useProductsStore.setState({ products });

      const state = useProductsStore.getState();
      expect(state.products).toEqual(products);
    });

    test('should return archived products', () => {
      const archivedProducts: Product[] = [
        {
          id: 'product-1',
          name: 'Real Madrid Home Kit',
          type: ProductType.SHIRT,
          sizes: [{ size: 'M', quantity: 10 }],
          namesetId: null,
          teamId: 'team-1',
          kitTypeId: 'kit-type-1',
          badgeId: null,
          price: 89.99,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      useProductsStore.setState({ archivedProducts });

      const state = useProductsStore.getState();
      expect(state.archivedProducts).toEqual(archivedProducts);
    });
  });

  describe('UPDATE Operations', () => {
    test('should update an existing product', () => {
      const originalProduct: Product = {
        id: 'product-1',
        name: 'Real Madrid Home Kit',
        type: ProductType.SHIRT,
        sizes: [{ size: 'M', quantity: 10 }],
        namesetId: null,
        teamId: 'team-1',
        kitTypeId: 'kit-type-1',
        badgeId: null,
        price: 89.99,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useProductsStore.setState({ products: [originalProduct] });

      const { updateProduct } = useProductsStore.getState();
      updateProduct('product-1', { 
        name: 'Real Madrid Home Kit 2024',
        price: 99.99 
      });

      const state = useProductsStore.getState();
      expect(state.products[0].name).toBe('Real Madrid Home Kit 2024');
      expect(state.products[0].price).toBe(99.99);
      expect(state.products[0].id).toBe('product-1');
      expect(state.products[0].createdAt).toBe(originalProduct.createdAt);
    });

    test('should update product sizes', () => {
      const originalProduct: Product = {
        id: 'product-1',
        name: 'Real Madrid Home Kit',
        type: ProductType.SHIRT,
        sizes: [{ size: 'M', quantity: 10 }],
        namesetId: null,
        teamId: 'team-1',
        kitTypeId: 'kit-type-1',
        badgeId: null,
        price: 89.99,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useProductsStore.setState({ products: [originalProduct] });

      const { updateProduct } = useProductsStore.getState();
      updateProduct('product-1', { 
        sizes: [
          { size: 'M', quantity: 5 },
          { size: 'L', quantity: 8 }
        ]
      });

      const state = useProductsStore.getState();
      expect(state.products[0].sizes).toHaveLength(2);
      expect(state.products[0].sizes[0]).toEqual({ size: 'M', quantity: 5 });
      expect(state.products[0].sizes[1]).toEqual({ size: 'L', quantity: 8 });
    });

    test('should not update non-existent product', () => {
      const originalProduct: Product = {
        id: 'product-1',
        name: 'Real Madrid Home Kit',
        type: ProductType.SHIRT,
        sizes: [{ size: 'M', quantity: 10 }],
        namesetId: null,
        teamId: 'team-1',
        kitTypeId: 'kit-type-1',
        badgeId: null,
        price: 89.99,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useProductsStore.setState({ products: [originalProduct] });

      const { updateProduct } = useProductsStore.getState();
      updateProduct('non-existent', { name: 'New Name' });

      const state = useProductsStore.getState();
      expect(state.products[0]).toEqual(originalProduct);
    });
  });

  describe('DELETE Operations', () => {
    test('should delete a product from active products', () => {
      const products: Product[] = [
        {
          id: 'product-1',
          name: 'Real Madrid Home Kit',
          type: ProductType.SHIRT,
          sizes: [{ size: 'M', quantity: 10 }],
          namesetId: null,
          teamId: 'team-1',
          kitTypeId: 'kit-type-1',
          badgeId: null,
          price: 89.99,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'product-2',
          name: 'Barcelona Away Kit',
          type: ProductType.SHIRT,
          sizes: [{ size: 'L', quantity: 5 }],
          namesetId: null,
          teamId: 'team-2',
          kitTypeId: 'kit-type-1',
          badgeId: null,
          price: 79.99,
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      useProductsStore.setState({ products });

      const { deleteProduct } = useProductsStore.getState();
      deleteProduct('product-1');

      const state = useProductsStore.getState();
      expect(state.products).toHaveLength(1);
      expect(state.products[0].id).toBe('product-2');
    });

    test('should delete a product from both active and archived products', () => {
      const products: Product[] = [
        {
          id: 'product-1',
          name: 'Real Madrid Home Kit',
          type: ProductType.SHIRT,
          sizes: [{ size: 'M', quantity: 10 }],
          namesetId: null,
          teamId: 'team-1',
          kitTypeId: 'kit-type-1',
          badgeId: null,
          price: 89.99,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const archivedProducts: Product[] = [
        {
          id: 'product-2',
          name: 'Barcelona Away Kit',
          type: ProductType.SHIRT,
          sizes: [{ size: 'L', quantity: 5 }],
          namesetId: null,
          teamId: 'team-2',
          kitTypeId: 'kit-type-1',
          badgeId: null,
          price: 79.99,
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      useProductsStore.setState({ products, archivedProducts });

      const { deleteProduct } = useProductsStore.getState();
      deleteProduct('product-1');
      deleteProduct('product-2');

      const state = useProductsStore.getState();
      expect(state.products).toHaveLength(0);
      expect(state.archivedProducts).toHaveLength(0);
    });
  });

  describe('ARCHIVE Operations', () => {
    test('should archive a product', () => {
      const product: Product = {
        id: 'product-1',
        name: 'Real Madrid Home Kit',
        type: ProductType.SHIRT,
        sizes: [{ size: 'M', quantity: 10 }],
        namesetId: null,
        teamId: 'team-1',
        kitTypeId: 'kit-type-1',
        badgeId: null,
        price: 89.99,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useProductsStore.setState({ products: [product], archivedProducts: [] });

      const { archiveProduct } = useProductsStore.getState();
      archiveProduct('product-1');

      const state = useProductsStore.getState();
      expect(state.products).toHaveLength(0);
      expect(state.archivedProducts).toHaveLength(1);
      expect(state.archivedProducts[0]).toEqual(product);
    });

    test('should restore an archived product', () => {
      const product: Product = {
        id: 'product-1',
        name: 'Real Madrid Home Kit',
        type: ProductType.SHIRT,
        sizes: [{ size: 'M', quantity: 10 }],
        namesetId: null,
        teamId: 'team-1',
        kitTypeId: 'kit-type-1',
        badgeId: null,
        price: 89.99,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useProductsStore.setState({ products: [], archivedProducts: [product] });

      const { restoreProduct } = useProductsStore.getState();
      restoreProduct('product-1');

      const state = useProductsStore.getState();
      expect(state.products).toHaveLength(1);
      expect(state.archivedProducts).toHaveLength(0);
      expect(state.products[0]).toEqual(product);
    });
  });

  describe('SET Operations', () => {
    test('should set products array', () => {
      const newProducts: Product[] = [
        {
          id: 'product-1',
          name: 'Real Madrid Home Kit',
          type: ProductType.SHIRT,
          sizes: [{ size: 'M', quantity: 10 }],
          namesetId: null,
          teamId: 'team-1',
          kitTypeId: 'kit-type-1',
          badgeId: null,
          price: 89.99,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'product-2',
          name: 'Barcelona Away Kit',
          type: ProductType.SHIRT,
          sizes: [{ size: 'L', quantity: 5 }],
          namesetId: null,
          teamId: 'team-2',
          kitTypeId: 'kit-type-1',
          badgeId: null,
          price: 79.99,
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      const { setProducts } = useProductsStore.getState();
      setProducts(newProducts);

      const state = useProductsStore.getState();
      expect(state.products).toEqual(newProducts);
    });

    test('should set archived products array', () => {
      const newArchivedProducts: Product[] = [
        {
          id: 'product-1',
          name: 'Real Madrid Home Kit',
          type: ProductType.SHIRT,
          sizes: [{ size: 'M', quantity: 10 }],
          namesetId: null,
          teamId: 'team-1',
          kitTypeId: 'kit-type-1',
          badgeId: null,
          price: 89.99,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const { setArchivedProducts } = useProductsStore.getState();
      setArchivedProducts(newArchivedProducts);

      const state = useProductsStore.getState();
      expect(state.archivedProducts).toEqual(newArchivedProducts);
    });
  });

  describe('Data Integrity', () => {
    test('should maintain data consistency during operations', () => {
      const product: Product = {
        id: 'product-1',
        name: 'Real Madrid Home Kit',
        type: ProductType.SHIRT,
        sizes: [{ size: 'M', quantity: 10 }],
        namesetId: null,
        teamId: 'team-1',
        kitTypeId: 'kit-type-1',
        badgeId: null,
        price: 89.99,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addProduct, archiveProduct, restoreProduct } = useProductsStore.getState();
      
      // Add product
      addProduct(product);
      expect(useProductsStore.getState().products).toHaveLength(1);
      
      // Archive product
      archiveProduct('product-1');
      expect(useProductsStore.getState().products).toHaveLength(0);
      expect(useProductsStore.getState().archivedProducts).toHaveLength(1);
      
      // Restore product
      restoreProduct('product-1');
      expect(useProductsStore.getState().products).toHaveLength(1);
      expect(useProductsStore.getState().archivedProducts).toHaveLength(0);
    });

    test('should handle complex product data correctly', () => {
      const complexProduct: Product = {
        id: 'product-1',
        name: 'Real Madrid Home Kit with Messi Nameset',
        type: ProductType.SHIRT,
        sizes: [
          { size: 'S', quantity: 5 },
          { size: 'M', quantity: 10 },
          { size: 'L', quantity: 8 },
          { size: 'XL', quantity: 3 },
        ],
        namesetId: 'nameset-messi',
        teamId: 'team-real-madrid',
        kitTypeId: 'kit-type-1st',
        badgeId: 'badge-champions',
        price: 129.99,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const { addProduct, updateProduct } = useProductsStore.getState();
      
      addProduct(complexProduct);
      expect(useProductsStore.getState().products[0]).toEqual(complexProduct);
      
      // Update with new sizes
      updateProduct('product-1', {
        sizes: [
          { size: 'S', quantity: 3 },
          { size: 'M', quantity: 12 },
          { size: 'L', quantity: 6 },
          { size: 'XL', quantity: 1 },
          { size: 'XXL', quantity: 2 },
        ]
      });
      
      const updatedProduct = useProductsStore.getState().products[0];
      expect(updatedProduct.sizes).toHaveLength(5);
      expect(updatedProduct.sizes.find(s => s.size === 'XXL')?.quantity).toBe(2);
    });
  });
});

