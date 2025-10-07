import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { KitType } from '../types';

interface KitTypesState {
  // State
  kitTypes: KitType[];
  archivedKitTypes: KitType[];

  // Actions
  addKitType: (kitType: KitType) => void;
  updateKitType: (id: string, updates: Partial<KitType>) => void;
  deleteKitType: (id: string) => void;
  archiveKitType: (id: string) => void;
  restoreKitType: (id: string) => void;
  setKitTypes: (kitTypes: KitType[]) => void;
  setArchivedKitTypes: (kitTypes: KitType[]) => void;
}

// Selectors
export const kitTypesSelectors = {
  getKitTypeById: (state: KitTypesState, id: string) => state.kitTypes.find((kt) => kt.id === id),
  getKitTypesByName: (state: KitTypesState, name: string) =>
    state.kitTypes.filter((kt) => kt.name.toLowerCase().includes(name.toLowerCase())),
  getTotalKitTypes: (state: KitTypesState) => state.kitTypes.length,
  getTotalArchivedKitTypes: (state: KitTypesState) => state.archivedKitTypes.length,
};

// Default kit types with fixed IDs
const defaultKitTypes: KitType[] = [
  { id: 'default-kit-type-1st', name: '1st Kit' },
  { id: 'default-kit-type-2nd', name: '2nd Kit' },
  { id: 'default-kit-type-3rd', name: '3rd Kit' },
  { id: 'default-kit-type-none', name: 'None' },
];

// Store
export const useKitTypesStore = create<KitTypesState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state with default kit types
        kitTypes: defaultKitTypes,
        archivedKitTypes: [],

        // Actions
        addKitType: (kitType: KitType) => {
          set((state) => ({
            kitTypes: [...state.kitTypes, kitType],
          }));
        },

        updateKitType: (id: string, updates: Partial<KitType>) => {
          set((state) => ({
            kitTypes: state.kitTypes.map((kt) => (kt.id === id ? { ...kt, ...updates } : kt)),
          }));
        },

        deleteKitType: (id: string) => {
          set((state) => ({
            kitTypes: state.kitTypes.filter((kt) => kt.id !== id),
            archivedKitTypes: state.archivedKitTypes.filter((kt) => kt.id !== id),
          }));
        },

        archiveKitType: (id: string) => {
          const kitType = get().kitTypes.find((kt) => kt.id === id);
          if (kitType) {
            set((state) => ({
              kitTypes: state.kitTypes.filter((kt) => kt.id !== id),
              archivedKitTypes: [...state.archivedKitTypes, kitType],
            }));
          }
        },

        restoreKitType: (id: string) => {
          const kitType = get().archivedKitTypes.find((kt) => kt.id === id);
          if (kitType) {
            set((state) => ({
              archivedKitTypes: state.archivedKitTypes.filter((kt) => kt.id !== id),
              kitTypes: [...state.kitTypes, kitType],
            }));
          }
        },

        setKitTypes: (kitTypes: KitType[]) => {
          set({ kitTypes });
        },

        setArchivedKitTypes: (archivedKitTypes: KitType[]) => {
          set({ archivedKitTypes });
        },
      }),
      {
        name: 'kit-types-store',
        partialize: (state) => ({
          kitTypes: state.kitTypes,
          archivedKitTypes: state.archivedKitTypes,
        }),
      }
    ),
    {
      name: 'kit-types-store',
    }
  )
);

// Typed selectors for easier usage
export const useKitTypes = () => useKitTypesStore();
export const useKitTypesList = () => useKitTypesStore((state) => state.kitTypes);
export const useArchivedKitTypes = () => useKitTypesStore((state) => state.archivedKitTypes);
export const useKitTypesActions = () => ({
  addKitType: useKitTypesStore.getState().addKitType,
  updateKitType: useKitTypesStore.getState().updateKitType,
  deleteKitType: useKitTypesStore.getState().deleteKitType,
  archiveKitType: useKitTypesStore.getState().archiveKitType,
  restoreKitType: useKitTypesStore.getState().restoreKitType,
  setKitTypes: useKitTypesStore.getState().setKitTypes,
  setArchivedKitTypes: useKitTypesStore.getState().setArchivedKitTypes,
});
