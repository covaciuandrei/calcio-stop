import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ProductImage } from '../types';

// Global cache to prevent duplicate requests
const imageCache = new Map<string, ProductImage[]>();
const pendingRequests = new Map<string, Promise<ProductImage[]>>();

// Cache invalidation function
export const invalidateProductImageCache = (productId?: string) => {
  if (productId) {
    imageCache.delete(productId);
    pendingRequests.delete(productId);
  } else {
    imageCache.clear();
    pendingRequests.clear();
  }
};

// Helper function to get images with caching and deduplication
const getProductImagesCached = async (productId: string): Promise<ProductImage[]> => {
  // Check cache first
  if (imageCache.has(productId)) {
    return imageCache.get(productId)!;
  }

  // Check if request is already pending
  if (pendingRequests.has(productId)) {
    return pendingRequests.get(productId)!;
  }

  // Create new request
  const request = (async () => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      // Map database response to frontend format
      const mappedImages = (data || []).map((item) => ({
        id: item.id,
        productId: item.product_id,
        imageUrl: item.image_url || item.large_url, // Legacy field fallback
        thumbnailUrl: item.thumbnail_url || item.image_url,
        mediumUrl: item.medium_url || item.image_url,
        largeUrl: item.large_url || item.image_url,
        altText: item.alt_text,
        isPrimary: item.is_primary,
        displayOrder: item.display_order,
        createdAt: item.created_at,
      }));

      // Cache the result
      imageCache.set(productId, mappedImages);
      // Remove from pending
      pendingRequests.delete(productId);
      return mappedImages;
    } catch (err) {
      // Remove from pending on error
      pendingRequests.delete(productId);
      throw err;
    }
  })();

  // Store pending request
  pendingRequests.set(productId, request);
  return request;
};

export const useProductImages = (productId: string) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    invalidateProductImageCache(productId);
    setRefetchTrigger((prev) => prev + 1);
  }, [productId]);

  useEffect(() => {
    const loadImages = async () => {
      if (!productId) {
        setImages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productImages = await getProductImagesCached(productId);
        setImages(productImages);
        setError(null);
      } catch (err) {
        console.error('Error loading product images:', err);
        setError(err instanceof Error ? err.message : 'Failed to load images');
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [productId, refetchTrigger]);

  return { images, loading, error, refetch };
};

export const useProductImagesMap = (productIds: string[]) => {
  const [imagesMap, setImagesMap] = useState<Record<string, ProductImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a stable dependency by joining product IDs
  const productIdsKey = productIds.join(',');

  useEffect(() => {
    const loadAllImages = async () => {
      if (productIds.length === 0) {
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
        const promises = productIds.map(async (productId) => {
          try {
            const images = await getProductImagesCached(productId);
            return { productId, images };
          } catch (err) {
            // Only log error if not aborted
            if (!abortControllerRef.current?.signal.aborted) {
              console.error(`Error loading images for product ${productId}:`, err);
            }
            return { productId, images: [] };
          }
        });

        const results = await Promise.all(promises);
        const map: Record<string, ProductImage[]> = {};
        results.forEach(({ productId, images }) => {
          map[productId] = images;
        });

        // Only update state if request wasn't aborted
        if (!abortControllerRef.current?.signal.aborted) {
          setImagesMap(map);
          setError(null);
        }
      } catch (err) {
        // Only log error if not aborted
        if (!abortControllerRef.current?.signal.aborted) {
          console.error('Error loading product images:', err);
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
  }, [productIdsKey, productIds]); // Include both the stable key and the original array

  return { imagesMap, loading, error };
};

// Debounced version to reduce rapid re-renders
export const useProductImagesMapDebounced = (productIds: string[], delay: number = 300) => {
  const [imagesMap, setImagesMap] = useState<Record<string, ProductImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a stable dependency by joining product IDs
  const productIdsKey = productIds.join(',');

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
      if (productIds.length === 0) {
        setImagesMap({});
        setLoading(false);
        return;
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);

        // Use cached requests to prevent duplicates
        const promises = productIds.map(async (productId) => {
          try {
            const images = await getProductImagesCached(productId);
            return { productId, images };
          } catch (err) {
            // Only log error if not aborted
            if (!abortControllerRef.current?.signal.aborted) {
              console.error(`Error loading images for product ${productId}:`, err);
            }
            return { productId, images: [] };
          }
        });

        const results = await Promise.all(promises);
        const map: Record<string, ProductImage[]> = {};
        results.forEach(({ productId, images }) => {
          map[productId] = images;
        });

        // Only update state if request wasn't aborted
        if (!abortControllerRef.current?.signal.aborted) {
          setImagesMap(map);
          setError(null);
        }
      } catch (err) {
        // Only log error if not aborted
        if (!abortControllerRef.current?.signal.aborted) {
          console.error('Error loading product images:', err);
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
  }, [productIdsKey, productIds, delay]);

  return { imagesMap, loading, error };
};
