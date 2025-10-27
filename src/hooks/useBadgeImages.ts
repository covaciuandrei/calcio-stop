import { useEffect, useState } from 'react';
import * as db from '../lib/db';
import { BadgeImage } from '../types';

export const useBadgeImages = (badgeId: string) => {
  const [images, setImages] = useState<BadgeImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      if (!badgeId) {
        setImages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const badgeImages = await db.getBadgeImages(badgeId);
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
  }, [badgeId]);

  return { images, loading, error };
};

export const useBadgeImagesMap = (badgeIds: string[]) => {
  const [imagesMap, setImagesMap] = useState<Record<string, BadgeImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create a stable dependency by joining badge IDs
  const badgeIdsKey = badgeIds.join(',');

  useEffect(() => {
    const loadAllImages = async () => {
      if (badgeIds.length === 0) {
        setImagesMap({});
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const promises = badgeIds.map(async (badgeId) => {
          try {
            const images = await db.getBadgeImages(badgeId);
            return { badgeId, images };
          } catch (err) {
            console.error(`Error loading images for badge ${badgeId}:`, err);
            return { badgeId, images: [] };
          }
        });

        const results = await Promise.all(promises);
        const map: Record<string, BadgeImage[]> = {};
        results.forEach(({ badgeId, images }) => {
          map[badgeId] = images;
        });

        setImagesMap(map);
        setError(null);
      } catch (err) {
        console.error('Error loading badge images:', err);
        setError(err instanceof Error ? err.message : 'Failed to load images');
        setImagesMap({});
      } finally {
        setLoading(false);
      }
    };

    loadAllImages();
  }, [badgeIdsKey, badgeIds]); // Include both the stable key and the original array

  return { imagesMap, loading, error };
};
