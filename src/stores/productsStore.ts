import { useMemo } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import * as db from '../lib/db';
import { Product } from '../types';

/**
 * Extracts related data (teams, namesets, kit types, badges) from products
 * and populates the respective stores to avoid redundant API requests.
 * This runs asynchronously to avoid blocking the main load operation.
 */
function extractAndPopulateRelatedData(products: Product[], isArchived: boolean) {
  // Run asynchronously to not block the main operation
  Promise.resolve().then(async () => {
    try {
      // Dynamically import stores to avoid circular dependencies
      const { useTeamsStore } = await import('./teamsStore');
      const { useNamesetsStore } = await import('./namesetsStore');
      const { useKitTypesStore } = await import('./kitTypesStore');
      const { useBadgesStore } = await import('./badgesStore');

      // Extract unique entities from products
      const teamsMap = new Map<string, any>();
      const namesetsMap = new Map<string, any>();
      const kitTypesMap = new Map<string, any>();
      const badgesMap = new Map<string, any>();

      products.forEach((product) => {
        if (product.team && product.team.id) {
          teamsMap.set(product.team.id, product.team);
        }
        if (product.nameset && product.nameset.id) {
          namesetsMap.set(product.nameset.id, product.nameset);
        }
        if (product.kitType && product.kitType.id) {
          kitTypesMap.set(product.kitType.id, product.kitType);
        }
        if (product.badge && product.badge.id) {
          badgesMap.set(product.badge.id, product.badge);
        }
      });

      // Get current store states
      const teamsState = useTeamsStore.getState();
      const namesetsState = useNamesetsStore.getState();
      const kitTypesState = useKitTypesStore.getState();
      const badgesState = useBadgesStore.getState();

      // Merge with existing data (only add if not already present)
      const existingTeams = isArchived ? teamsState.archivedTeams : teamsState.teams;
      const existingNamesets = isArchived ? namesetsState.archivedNamesets : namesetsState.namesets;
      const existingKitTypes = isArchived ? kitTypesState.archivedKitTypes : kitTypesState.kitTypes;
      const existingBadges = isArchived ? badgesState.archivedBadges : badgesState.badges;

      const newTeams = Array.from(teamsMap.values()).filter((team) => !existingTeams.some((t) => t.id === team.id));
      const newNamesets = Array.from(namesetsMap.values()).filter(
        (nameset) => !existingNamesets.some((n) => n.id === nameset.id)
      );
      const newKitTypes = Array.from(kitTypesMap.values()).filter(
        (kitType) => !existingKitTypes.some((kt) => kt.id === kitType.id)
      );
      const newBadges = Array.from(badgesMap.values()).filter(
        (badge) => !existingBadges.some((b) => b.id === badge.id)
      );

      // Update stores only if we have new data
      if (newTeams.length > 0) {
        if (isArchived) {
          useTeamsStore.getState().setArchivedTeams([...existingTeams, ...newTeams]);
        } else {
          useTeamsStore.getState().setTeams([...existingTeams, ...newTeams]);
        }
      }

      if (newNamesets.length > 0) {
        if (isArchived) {
          useNamesetsStore.getState().setArchivedNamesets([...existingNamesets, ...newNamesets]);
        } else {
          useNamesetsStore.getState().setNamesets([...existingNamesets, ...newNamesets]);
        }
      }

      if (newKitTypes.length > 0) {
        if (isArchived) {
          useKitTypesStore.getState().setArchivedKitTypes([...existingKitTypes, ...newKitTypes]);
        } else {
          useKitTypesStore.getState().setKitTypes([...existingKitTypes, ...newKitTypes]);
        }
      }

      if (newBadges.length > 0) {
        if (isArchived) {
          useBadgesStore.getState().setArchivedBadges([...existingBadges, ...newBadges]);
        } else {
          useBadgesStore.getState().setBadges([...existingBadges, ...newBadges]);
        }
      }
    } catch (error) {
      // Silently fail - this is an optimization, not critical
      console.warn('Failed to extract related data from products:', error);
    }
  });
}

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

          // Extract related data from products and populate stores to avoid redundant requests
          extractAndPopulateRelatedData(products, false);
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

          // Extract related data from archived products and populate stores
          extractAndPopulateRelatedData(archivedProducts, true);
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
export const useSoldOutProducts = () => {
  const products = useProductsStore(useShallow((state) => state.products));
  return useMemo(
    () => products.filter((p) => p.sizes.every((s) => s.quantity === 0)),
    [products]
  );
};
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
