// Default kit type IDs that should not be archivable or deletable
export const DEFAULT_KIT_TYPE_IDS = [
  'default-kit-type-1st',
  'default-kit-type-2nd',
  'default-kit-type-3rd',
  'default-kit-type-none',
] as const;

// Helper function to check if a kit type ID is a default one
export const isDefaultKitType = (id: string): boolean => {
  return DEFAULT_KIT_TYPE_IDS.includes(id as any);
};
