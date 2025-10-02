import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Product } from '../types';

interface ProductsState {
  // State
  products: Product[];
  archivedProducts: Product[];

  // Actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  archiveProduct: (id: string) => void;
  restoreProduct: (id: string) => void;
  setProducts: (products: Product[]) => void;
  setArchivedProducts: (products: Product[]) => void;
}

// Selectors
export const productsSelectors = {
  getProductById: (state: ProductsState, id: string) => state.products.find((p) => p.id === id),
  getProductsByTeam: (state: ProductsState, teamId: string) => state.products.filter((p) => p.teamId === teamId),
  getProductsByNameset: (state: ProductsState, namesetId: string) =>
    state.products.filter((p) => p.namesetId === namesetId),
  getAvailableProducts: (state: ProductsState) => state.products.filter((p) => p.sizes.some((s) => s.quantity > 0)),
  getTotalProducts: (state: ProductsState) => state.products.length,
  getTotalArchivedProducts: (state: ProductsState) => state.archivedProducts.length,
};

// Store
export const useProductsStore = create<ProductsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        products: [],
        archivedProducts: [],

        // Actions
        addProduct: (product: Product) => {
          set((state) => ({
            products: [...state.products, product],
          }));
        },

        updateProduct: (id: string, updates: Partial<Product>) => {
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          }));
        },

        deleteProduct: (id: string) => {
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
          }));
        },

        archiveProduct: (id: string) => {
          const product = get().products.find((p) => p.id === id);
          if (product) {
            set((state) => ({
              products: state.products.filter((p) => p.id !== id),
              archivedProducts: [...state.archivedProducts, product],
            }));
          }
        },

        restoreProduct: (id: string) => {
          const product = get().archivedProducts.find((p) => p.id === id);
          if (product) {
            set((state) => ({
              archivedProducts: state.archivedProducts.filter((p) => p.id !== id),
              products: [...state.products, product],
            }));
          }
        },

        setProducts: (products: Product[]) => {
          set({ products });
        },

        setArchivedProducts: (archivedProducts: Product[]) => {
          set({ archivedProducts });
        },
      }),
      {
        name: 'products-store',
        partialize: (state) => ({
          products: state.products,
          archivedProducts: state.archivedProducts,
        }),
      }
    ),
    {
      name: 'products-store',
    }
  )
);

// Typed selectors for easier usage
export const useProducts = () => useProductsStore();
export const useProductsList = () => useProductsStore((state) => state.products);
export const useArchivedProducts = () => useProductsStore((state) => state.archivedProducts);
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
});
