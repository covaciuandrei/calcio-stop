import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as db from '../lib/db';
import { ProductLink, Seller } from '../types';
import { getErrorMessage, isForeignKeyConstraintError } from '../utils/errorHandler';

interface SuppliersState {
  // Sellers state
  sellers: Seller[];
  archivedSellers: Seller[];
  sellersLoading: boolean;
  sellersError: string | null;

  // Product Links state
  productLinks: ProductLink[];
  productLinksLoading: boolean;
  productLinksError: string | null;

  // Sellers actions
  addSeller: (seller: Omit<Seller, 'id' | 'createdAt'>) => Promise<void>;
  updateSeller: (id: string, updates: Partial<Seller>) => Promise<void>;
  deleteSeller: (id: string) => Promise<void>;
  archiveSeller: (id: string) => Promise<void>;
  restoreSeller: (id: string) => Promise<void>;
  setSellers: (sellers: Seller[]) => void;
  setArchivedSellers: (sellers: Seller[]) => void;
  loadSellers: () => Promise<void>;
  loadArchivedSellers: () => Promise<void>;
  clearSellersError: () => void;

  // Product Links actions
  addProductLink: (productLink: Omit<ProductLink, 'id' | 'createdAt'>) => Promise<void>;
  updateProductLink: (id: string, updates: Partial<ProductLink>) => Promise<void>;
  deleteProductLink: (id: string) => Promise<void>;
  setProductLinks: (productLinks: ProductLink[]) => void;
  loadProductLinks: () => Promise<void>;
  clearProductLinksError: () => void;
}

// Selectors
export const suppliersSelectors = {
  getSellerById: (state: SuppliersState, id: string) => state.sellers.find((s) => s.id === id),
  getSellersByProductId: (state: SuppliersState, productId: string) =>
    state.sellers.filter((s) => s.productIds.includes(productId)),
  getProductLinksByProductId: (state: SuppliersState, productId: string) =>
    state.productLinks.filter((pl) => pl.productId === productId),
  getProductLinksBySellerId: (state: SuppliersState, sellerId: string) =>
    state.productLinks.filter((pl) => pl.sellerId === sellerId),
};

// Store
export const useSuppliersStore = create<SuppliersState>()(
  devtools(
    (set, get) => ({
      // Initial state
      sellers: [],
      archivedSellers: [],
      sellersLoading: false,
      sellersError: null,
      productLinks: [],
      productLinksLoading: false,
      productLinksError: null,

      // Sellers actions
      addSeller: async (sellerData: Omit<Seller, 'id' | 'createdAt'>) => {
        set({ sellersLoading: true, sellersError: null });
        try {
          const newSeller = await db.createSeller({
            ...sellerData,
            createdAt: new Date().toISOString(),
          });
          set((state) => ({
            sellers: [...state.sellers, newSeller],
            sellersLoading: false,
          }));
        } catch (error) {
          set({
            sellersError: error instanceof Error ? error.message : 'Failed to add seller',
            sellersLoading: false,
          });
        }
      },

      updateSeller: async (id: string, updates: Partial<Seller>) => {
        set({ sellersLoading: true, sellersError: null });
        try {
          const updatedSeller = await db.updateSeller(id, updates);
          set((state) => ({
            sellers: state.sellers.map((s) => (s.id === id ? updatedSeller : s)),
            archivedSellers: state.archivedSellers.map((s) => (s.id === id ? updatedSeller : s)),
            sellersLoading: false,
          }));
        } catch (error) {
          set({
            sellersError: error instanceof Error ? error.message : 'Failed to update seller',
            sellersLoading: false,
          });
        }
      },

      deleteSeller: async (id: string) => {
        set({ sellersLoading: true, sellersError: null });
        try {
          await db.deleteSeller(id);
          set((state) => ({
            sellers: state.sellers.filter((s) => s.id !== id),
            archivedSellers: state.archivedSellers.filter((s) => s.id !== id),
            sellersLoading: false,
          }));
        } catch (error) {
          const errorMessage = getErrorMessage(error as Error, 'delete', 'seller');
          set({
            sellersError: errorMessage,
            sellersLoading: false,
          });

          // If it's a foreign key constraint, suggest archiving instead
          if (isForeignKeyConstraintError(error as Error)) {
            console.warn('Foreign key constraint detected. Consider archiving instead of deleting.');
          }
        }
      },

      archiveSeller: async (id: string) => {
        set({ sellersLoading: true, sellersError: null });
        try {
          const archivedSeller = await db.archiveSeller(id);
          set((state) => ({
            sellers: state.sellers.filter((s) => s.id !== id),
            archivedSellers: [...state.archivedSellers, archivedSeller],
            sellersLoading: false,
          }));
        } catch (error) {
          set({
            sellersError: error instanceof Error ? error.message : 'Failed to archive seller',
            sellersLoading: false,
          });
        }
      },

      restoreSeller: async (id: string) => {
        set({ sellersLoading: true, sellersError: null });
        try {
          const restoredSeller = await db.restoreSeller(id);
          set((state) => ({
            archivedSellers: state.archivedSellers.filter((s) => s.id !== id),
            sellers: [...state.sellers, restoredSeller],
            sellersLoading: false,
          }));
        } catch (error) {
          set({
            sellersError: error instanceof Error ? error.message : 'Failed to restore seller',
            sellersLoading: false,
          });
        }
      },

      setSellers: (sellers: Seller[]) => {
        set({ sellers });
      },

      setArchivedSellers: (archivedSellers: Seller[]) => {
        set({ archivedSellers });
      },

      loadSellers: async () => {
        set({ sellersLoading: true, sellersError: null });
        try {
          const sellers = await db.getSellers();
          set({ sellers, sellersLoading: false });
        } catch (error) {
          set({
            sellersError: error instanceof Error ? error.message : 'Failed to load sellers',
            sellersLoading: false,
          });
        }
      },

      loadArchivedSellers: async () => {
        set({ sellersLoading: true, sellersError: null });
        try {
          const archivedSellers = await db.getArchivedSellers();
          set({ archivedSellers, sellersLoading: false });
        } catch (error) {
          set({
            sellersError: error instanceof Error ? error.message : 'Failed to load archived sellers',
            sellersLoading: false,
          });
        }
      },

      clearSellersError: () => {
        set({ sellersError: null });
      },

      // Product Links actions
      addProductLink: async (productLinkData: Omit<ProductLink, 'id' | 'createdAt'>) => {
        set({ productLinksLoading: true, productLinksError: null });
        try {
          const newProductLink = await db.createProductLink({
            ...productLinkData,
            createdAt: new Date().toISOString(),
          });
          set((state) => ({
            productLinks: [...state.productLinks, newProductLink],
            productLinksLoading: false,
          }));
        } catch (error) {
          set({
            productLinksError: error instanceof Error ? error.message : 'Failed to add product link',
            productLinksLoading: false,
          });
        }
      },

      updateProductLink: async (id: string, updates: Partial<ProductLink>) => {
        set({ productLinksLoading: true, productLinksError: null });
        try {
          const updatedProductLink = await db.updateProductLink(id, updates);
          set((state) => ({
            productLinks: state.productLinks.map((pl) => (pl.id === id ? updatedProductLink : pl)),
            productLinksLoading: false,
          }));
        } catch (error) {
          set({
            productLinksError: error instanceof Error ? error.message : 'Failed to update product link',
            productLinksLoading: false,
          });
        }
      },

      deleteProductLink: async (id: string) => {
        set({ productLinksLoading: true, productLinksError: null });
        try {
          await db.deleteProductLink(id);
          set((state) => ({
            productLinks: state.productLinks.filter((pl) => pl.id !== id),
            productLinksLoading: false,
          }));
        } catch (error) {
          set({
            productLinksError: error instanceof Error ? error.message : 'Failed to delete product link',
            productLinksLoading: false,
          });
        }
      },

      setProductLinks: (productLinks: ProductLink[]) => {
        set({ productLinks });
      },

      loadProductLinks: async () => {
        set({ productLinksLoading: true, productLinksError: null });
        try {
          const productLinks = await db.getProductLinks();
          set({ productLinks, productLinksLoading: false });
        } catch (error) {
          set({
            productLinksError: error instanceof Error ? error.message : 'Failed to load product links',
            productLinksLoading: false,
          });
        }
      },

      clearProductLinksError: () => {
        set({ productLinksError: null });
      },
    }),
    {
      name: 'suppliers-store',
    }
  )
);

// Typed selectors for easier usage
export const useSuppliers = () => useSuppliersStore();
export const useSellersList = () => useSuppliersStore((state) => state.sellers);
export const useArchivedSellers = () => useSuppliersStore((state) => state.archivedSellers);
export const useProductLinksList = () => useSuppliersStore((state) => state.productLinks);
export const useSuppliersActions = () => ({
  addSeller: useSuppliersStore.getState().addSeller,
  updateSeller: useSuppliersStore.getState().updateSeller,
  deleteSeller: useSuppliersStore.getState().deleteSeller,
  archiveSeller: useSuppliersStore.getState().archiveSeller,
  restoreSeller: useSuppliersStore.getState().restoreSeller,
  setSellers: useSuppliersStore.getState().setSellers,
  setArchivedSellers: useSuppliersStore.getState().setArchivedSellers,
  loadSellers: useSuppliersStore.getState().loadSellers,
  loadArchivedSellers: useSuppliersStore.getState().loadArchivedSellers,
  addProductLink: useSuppliersStore.getState().addProductLink,
  updateProductLink: useSuppliersStore.getState().updateProductLink,
  deleteProductLink: useSuppliersStore.getState().deleteProductLink,
  setProductLinks: useSuppliersStore.getState().setProductLinks,
  loadProductLinks: useSuppliersStore.getState().loadProductLinks,
});
