import { useMemo } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as db from '../lib/db';
import { Product } from '../types';

interface ProductsState {
  // State
  products: Product[];
  archivedProducts: Product[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  archiveProduct: (id: string) => Promise<void>;
  restoreProduct: (id: string) => Promise<void>;
  setProducts: (products: Product[]) => void;
  setArchivedProducts: (products: Product[]) => void;
  loadProducts: () => Promise<void>;
  loadArchivedProducts: () => Promise<void>;
  clearError: () => void;
}

// Selectors
export const productsSelectors = {
  getProductById: (state: ProductsState, id: string) => state.products.find((p) => p.id === id),
  getProductsByTeam: (state: ProductsState, teamId: string) => state.products.filter((p) => p.teamId === teamId),
  getProductsByNameset: (state: ProductsState, namesetId: string) =>
    state.products.filter((p) => p.namesetId === namesetId),
  getAvailableProducts: (state: ProductsState) => state.products.filter((p) => p.sizes.some((s) => s.quantity > 0)),
  getSoldOutProducts: (state: ProductsState) => state.products.filter((p) => p.sizes.every((s) => s.quantity === 0)),
  getAllProducts: (state: ProductsState) => [...state.products, ...state.archivedProducts], // Combined active and archived
  getTotalProducts: (state: ProductsState) => state.products.length,
  getTotalArchivedProducts: (state: ProductsState) => state.archivedProducts.length,
};

// Store
export const useProductsStore = create<ProductsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      products: [],
      archivedProducts: [],
      isLoading: false,
      error: null,

      // Actions
      addProduct: async (productData: Omit<Product, 'id' | 'createdAt'>) => {
        set({ isLoading: true, error: null });
        try {
          const newProduct = await db.createProduct({
            ...productData,
            createdAt: new Date().toISOString(),
          });

          // Calculate total quantity of all sizes in the product
          const totalProductQuantity = productData.sizes.reduce((total, sizeQty) => total + sizeQty.quantity, 0);

          // Update nameset quantity if a nameset was selected
          if (productData.namesetId && totalProductQuantity > 0) {
            try {
              // Get current nameset from the namesets store
              const { useNamesetsStore } = await import('./namesetsStore');
              const namesetsState = useNamesetsStore.getState();
              const selectedNameset = namesetsState.namesets.find((n) => n.id === productData.namesetId);

              if (selectedNameset) {
                await namesetsState.updateNameset(productData.namesetId, {
                  quantity: Math.max(0, selectedNameset.quantity - totalProductQuantity),
                });
              }
            } catch (namesetError) {
              console.error('Error updating nameset quantity:', namesetError);
              // Don't fail the product creation if nameset update fails
            }
          }

          // Update badge quantity if a badge was selected
          if (productData.badgeId && totalProductQuantity > 0) {
            try {
              // Get current badge from the badges store
              const { useBadgesStore } = await import('./badgesStore');
              const badgesState = useBadgesStore.getState();
              const selectedBadge = badgesState.badges.find((b) => b.id === productData.badgeId);

              if (selectedBadge) {
                await badgesState.updateBadge(productData.badgeId, {
                  quantity: Math.max(0, selectedBadge.quantity - totalProductQuantity),
                });
              }
            } catch (badgeError) {
              console.error('Error updating badge quantity:', badgeError);
              // Don't fail the product creation if badge update fails
            }
          }

          set((state) => ({
            products: [...state.products, newProduct],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add product',
            isLoading: false,
          });
        }
      },

      updateProduct: async (id: string, updates: Partial<Product>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedProduct = await db.updateProduct(id, updates);
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
            archivedProducts: state.archivedProducts.map((p) => (p.id === id ? updatedProduct : p)),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update product',
            isLoading: false,
          });
        }
      },

      deleteProduct: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await db.deleteProduct(id);
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
            archivedProducts: state.archivedProducts.filter((p) => p.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete product',
            isLoading: false,
          });
        }
      },

      archiveProduct: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const archivedProduct = await db.archiveProduct(id);
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
            archivedProducts: [...state.archivedProducts, archivedProduct],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to archive product',
            isLoading: false,
          });
        }
      },

      restoreProduct: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const restoredProduct = await db.restoreProduct(id);
          set((state) => ({
            archivedProducts: state.archivedProducts.filter((p) => p.id !== id),
            products: [...state.products, restoredProduct],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to restore product',
            isLoading: false,
          });
        }
      },

      setProducts: (products: Product[]) => {
        set({ products });
      },

      setArchivedProducts: (archivedProducts: Product[]) => {
        set({ archivedProducts });
      },

      loadProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          const products = await db.getProducts();
          set({ products, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load products',
            isLoading: false,
          });
        }
      },

      loadArchivedProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          const archivedProducts = await db.getArchivedProducts();
          set({ archivedProducts, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load archived products',
            isLoading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'products-store',
    }
  )
);

// Typed selectors for easier usage
export const useProducts = () => useProductsStore();
export const useProductsList = () => useProductsStore((state) => state.products);
export const useArchivedProducts = () => useProductsStore((state) => state.archivedProducts);
export const useAllProducts = () => {
  const products = useProductsStore((state) => state.products);
  const archivedProducts = useProductsStore((state) => state.archivedProducts);

  return useMemo(() => [...products, ...archivedProducts], [products, archivedProducts]);
};
export const useSoldOutProducts = () => useProductsStore((state) => state.products);
// Individual action hooks to avoid object recreation
export const useAddProduct = () => useProductsStore((state) => state.addProduct);
export const useUpdateProduct = () => useProductsStore((state) => state.updateProduct);
export const useDeleteProduct = () => useProductsStore((state) => state.deleteProduct);
export const useArchiveProduct = () => useProductsStore((state) => state.archiveProduct);
export const useRestoreProduct = () => useProductsStore((state) => state.restoreProduct);
export const useSetProducts = () => useProductsStore((state) => state.setProducts);
export const useSetArchivedProducts = () => useProductsStore((state) => state.setArchivedProducts);

// For backward compatibility, but this might cause re-renders
export const useProductsActions = () => ({
  addProduct: useProductsStore.getState().addProduct,
  updateProduct: useProductsStore.getState().updateProduct,
  deleteProduct: useProductsStore.getState().deleteProduct,
  archiveProduct: useProductsStore.getState().archiveProduct,
  restoreProduct: useProductsStore.getState().restoreProduct,
  setProducts: useProductsStore.getState().setProducts,
  setArchivedProducts: useProductsStore.getState().setArchivedProducts,
  loadProducts: useProductsStore.getState().loadProducts,
  loadArchivedProducts: useProductsStore.getState().loadArchivedProducts,
});
