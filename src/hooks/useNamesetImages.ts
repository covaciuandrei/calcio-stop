import { useCallback, useEffect, useRef, useState } from 'react';
import * as db from '../lib/db';
import { useNamesetsStore } from '../stores/namesetsStore';
import { NamesetImage } from '../types';

// Global cache to prevent duplicate requests
const imageCache = new Map<string, NamesetImage[]>();
const pendingRequests = new Map<string, Promise<NamesetImage[]>>();

// Cache invalidation function
export const invalidateNamesetImageCache = (namesetId?: string) => {
  if (namesetId) {
    imageCache.delete(namesetId);
    pendingRequests.delete(namesetId);
  } else {
    imageCache.clear();
    pendingRequests.clear();
  }
};

// Helper function to get images with caching and deduplication
// First checks the store (from optimized queries), then cache, then makes API call
const getNamesetImagesCached = async (namesetId: string): Promise<NamesetImage[]> => {
  // First, check if nameset exists in store with images (from optimized query)
  const state = useNamesetsStore.getState();
  const nameset =
    state.namesets.find((n) => n.id === namesetId) || state.archivedNamesets.find((n) => n.id === namesetId);
  if (nameset && nameset.images && nameset.images.length > 0) {
    // Images already loaded from optimized query, cache them and return
    imageCache.set(namesetId, nameset.images);
    return nameset.images;
  }

  // Check cache second
  if (imageCache.has(namesetId)) {
    return imageCache.get(namesetId)!;
  }

  // Check if request is already pending
  if (pendingRequests.has(namesetId)) {
    return pendingRequests.get(namesetId)!;
  }

  // Create new request (fallback if images not in store)
  const request = db
    .getNamesetImages(namesetId)
    .then((images) => {
      // Cache the result
      imageCache.set(namesetId, images);
      // Remove from pending
      pendingRequests.delete(namesetId);
      return images;
    })
    .catch((err) => {
      // Remove from pending on error
      pendingRequests.delete(namesetId);
      throw err;
    });

  // Store pending request
  pendingRequests.set(namesetId, request);
  return request;
};

export const useNamesetImages = (namesetId: string) => {
  const [images, setImages] = useState<NamesetImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    invalidateNamesetImageCache(namesetId);
    setRefetchTrigger((prev) => prev + 1);
  }, [namesetId]);

  useEffect(() => {
    const loadImages = async () => {
      if (!namesetId) {
        setImages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const namesetImages = await getNamesetImagesCached(namesetId);
        setImages(namesetImages);
        setError(null);
      } catch (err) {
        console.error('Error loading nameset images:', err);
        setError(err instanceof Error ? err.message : 'Failed to load images');
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [namesetId, refetchTrigger]);

  return { images, loading, error, refetch };
};

export const useNamesetImagesMap = (namesetIds: string[]) => {
  const [imagesMap, setImagesMap] = useState<Record<string, NamesetImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a stable dependency by joining nameset IDs
  const namesetIdsKey = namesetIds.join(',');

  useEffect(() => {
    const loadAllImages = async () => {
      if (namesetIds.length === 0) {
        setImagesMap({});
        setLoading(false);
        return;
      }

      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);

        // First, check store for images (from optimized queries) - get current state inside effect
        const state = useNamesetsStore.getState();
        const allNamesets = [...state.namesets, ...state.archivedNamesets];
        const map: Record<string, NamesetImage[]> = {};
        const missingIds: string[] = [];

        namesetIds.forEach((namesetId) => {
          const nameset = allNamesets.find((n) => n.id === namesetId);
          if (nameset && nameset.images && nameset.images.length > 0) {
            map[namesetId] = nameset.images;
            // Cache them
            imageCache.set(namesetId, nameset.images);
          } else {
            missingIds.push(namesetId);
          }
        });

        // Only fetch missing images via API
        if (missingIds.length > 0 && !abortControllerRef.current?.signal.aborted) {
          const promises = missingIds.map(async (namesetId) => {
            try {
              const images = await getNamesetImagesCached(namesetId);
              return { namesetId, images };
            } catch (err) {
              // Only log error if not aborted
              if (!abortControllerRef.current?.signal.aborted) {
                console.error(`Error loading images for nameset ${namesetId}:`, err);
              }
              return { namesetId, images: [] };
            }
          });

          const results = await Promise.all(promises);
          results.forEach(({ namesetId, images }) => {
            map[namesetId] = images;
          });
        }

        // Only update state if request wasn't aborted
        if (!abortControllerRef.current?.signal.aborted) {
          setImagesMap(map);
          setError(null);
        }
      } catch (err) {
        // Only log error if not aborted
        if (!abortControllerRef.current?.signal.aborted) {
          console.error('Error loading nameset images:', err);
          setError(err instanceof Error ? err.message : 'Failed to load images');
          setImagesMap({});
        }
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadAllImages();

    // Cleanup function to abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [namesetIdsKey, namesetIds]); // Include both the stable key and the original array

  return { imagesMap, loading, error };
};

// Debounced version to reduce rapid re-renders
export const useNamesetImagesMapDebounced = (namesetIds: string[], delay: number = 300) => {
  const [imagesMap, setImagesMap] = useState<Record<string, NamesetImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a stable dependency by joining nameset IDs
  const namesetIdsKey = namesetIds.join(',');

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Debounce the request
    timeoutRef.current = setTimeout(async () => {
      if (namesetIds.length === 0) {
        setImagesMap({});
        setLoading(false);
        return;
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);

        // First, check store for images (from optimized queries) - get current state inside effect
        const state = useNamesetsStore.getState();
        const allNamesets = [...state.namesets, ...state.archivedNamesets];
        const map: Record<string, NamesetImage[]> = {};
        const missingIds: string[] = [];

        namesetIds.forEach((namesetId) => {
          const nameset = allNamesets.find((n) => n.id === namesetId);
          if (nameset && nameset.images && nameset.images.length > 0) {
            map[namesetId] = nameset.images;
            // Cache them
            imageCache.set(namesetId, nameset.images);
          } else {
            missingIds.push(namesetId);
          }
        });

        // Only fetch missing images via API
        if (missingIds.length > 0 && !abortControllerRef.current?.signal.aborted) {
          const promises = missingIds.map(async (namesetId) => {
            try {
              const images = await getNamesetImagesCached(namesetId);
              return { namesetId, images };
            } catch (err) {
              // Only log error if not aborted
              if (!abortControllerRef.current?.signal.aborted) {
                console.error(`Error loading images for nameset ${namesetId}:`, err);
              }
              return { namesetId, images: [] };
            }
          });

          const results = await Promise.all(promises);
          results.forEach(({ namesetId, images }) => {
            map[namesetId] = images;
          });
        }

        // Only update state if request wasn't aborted
        if (!abortControllerRef.current?.signal.aborted) {
          setImagesMap(map);
          setError(null);
        }
      } catch (err) {
        // Only log error if not aborted
        if (!abortControllerRef.current?.signal.aborted) {
          console.error('Error loading nameset images:', err);
          setError(err instanceof Error ? err.message : 'Failed to load images');
          setImagesMap({});
        }
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          setLoading(false);
        }
      }
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [namesetIdsKey, namesetIds, delay]);

  return { imagesMap, loading, error };
};
