import { useCallback, useEffect, useRef, useState } from 'react';
import * as db from '../lib/db';
import { BadgeImage } from '../types';

// Global cache to prevent duplicate requests
const imageCache = new Map<string, BadgeImage[]>();
const pendingRequests = new Map<string, Promise<BadgeImage[]>>();

// Cache invalidation function
export const invalidateBadgeImageCache = (badgeId?: string) => {
  if (badgeId) {
    imageCache.delete(badgeId);
    pendingRequests.delete(badgeId);
  } else {
    imageCache.clear();
    pendingRequests.clear();
  }
};

// Helper function to get images with caching and deduplication
const getBadgeImagesCached = async (badgeId: string): Promise<BadgeImage[]> => {
  // Check cache first
  if (imageCache.has(badgeId)) {
    return imageCache.get(badgeId)!;
  }

  // Check if request is already pending
  if (pendingRequests.has(badgeId)) {
    return pendingRequests.get(badgeId)!;
  }

  // Create new request
  const request = db
    .getBadgeImages(badgeId)
    .then((images) => {
      // Cache the result
      imageCache.set(badgeId, images);
      // Remove from pending
      pendingRequests.delete(badgeId);
      return images;
    })
    .catch((err) => {
      // Remove from pending on error
      pendingRequests.delete(badgeId);
      throw err;
    });

  // Store pending request
  pendingRequests.set(badgeId, request);
  return request;
};

export const useBadgeImages = (badgeId: string) => {
  const [images, setImages] = useState<BadgeImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    invalidateBadgeImageCache(badgeId);
    setRefetchTrigger((prev) => prev + 1);
  }, [badgeId]);

  useEffect(() => {
    const loadImages = async () => {
      if (!badgeId) {
        setImages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const badgeImages = await getBadgeImagesCached(badgeId);
        setImages(badgeImages);
        setError(null);
      } catch (err) {
        console.error('Error loading badge images:', err);
        setError(err instanceof Error ? err.message : 'Failed to load images');
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [badgeId, refetchTrigger]);

  return { images, loading, error, refetch };
};

export const useBadgeImagesMap = (badgeIds: string[]) => {
  const [imagesMap, setImagesMap] = useState<Record<string, BadgeImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a stable dependency by joining badge IDs
  const badgeIdsKey = badgeIds.join(',');

  useEffect(() => {
    const loadAllImages = async () => {
      if (badgeIds.length === 0) {
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

        // Use cached requests to prevent duplicates
        const promises = badgeIds.map(async (badgeId) => {
          try {
            const images = await getBadgeImagesCached(badgeId);
            return { badgeId, images };
          } catch (err) {
            // Only log error if not aborted
            if (!abortControllerRef.current?.signal.aborted) {
              console.error(`Error loading images for badge ${badgeId}:`, err);
            }
            return { badgeId, images: [] };
          }
        });

        const results = await Promise.all(promises);
        const map: Record<string, BadgeImage[]> = {};
        results.forEach(({ badgeId, images }) => {
          map[badgeId] = images;
        });

        // Only update state if request wasn't aborted
        if (!abortControllerRef.current?.signal.aborted) {
          setImagesMap(map);
          setError(null);
        }
      } catch (err) {
        // Only log error if not aborted
        if (!abortControllerRef.current?.signal.aborted) {
          console.error('Error loading badge images:', err);
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
  }, [badgeIdsKey, badgeIds]); // Include both the stable key and the original array

  return { imagesMap, loading, error };
};

// Debounced version to reduce rapid re-renders
export const useBadgeImagesMapDebounced = (badgeIds: string[], delay: number = 300) => {
  const [imagesMap, setImagesMap] = useState<Record<string, BadgeImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a stable dependency by joining badge IDs
  const badgeIdsKey = badgeIds.join(',');

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
      if (badgeIds.length === 0) {
        setImagesMap({});
        setLoading(false);
        return;
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);

        // Use cached requests to prevent duplicates
        const promises = badgeIds.map(async (badgeId) => {
          try {
            const images = await getBadgeImagesCached(badgeId);
            return { badgeId, images };
          } catch (err) {
            // Only log error if not aborted
            if (!abortControllerRef.current?.signal.aborted) {
              console.error(`Error loading images for badge ${badgeId}:`, err);
            }
            return { badgeId, images: [] };
          }
        });

        const results = await Promise.all(promises);
        const map: Record<string, BadgeImage[]> = {};
        results.forEach(({ badgeId, images }) => {
          map[badgeId] = images;
        });

        // Only update state if request wasn't aborted
        if (!abortControllerRef.current?.signal.aborted) {
          setImagesMap(map);
          setError(null);
        }
      } catch (err) {
        // Only log error if not aborted
        if (!abortControllerRef.current?.signal.aborted) {
          console.error('Error loading badge images:', err);
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
  }, [badgeIdsKey, badgeIds, delay]);

  return { imagesMap, loading, error };
};
