// Default kit type names that should not be archivable or deletable
export const DEFAULT_KIT_TYPE_NAMES = ['1st Kit', '2nd Kit', '3rd Kit', 'None'] as const;

// Helper function to check if a kit type is a default one (by name)
export const isDefaultKitType = (kitType: { id: string; name: string } | string): boolean => {
  // If it's a string, assume it's an ID and we can't check by name
  if (typeof kitType === 'string') {
    return false;
  }

  return DEFAULT_KIT_TYPE_NAMES.includes(kitType.name as any);
};
