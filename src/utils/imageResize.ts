// Utility function to resize images to specific dimensions
// Used for creating thumbnail, medium, and large versions

export interface ResizeOptions {
  maxWidth: number;
  maxHeight: number;
  quality?: number;
}

export type ImageSize = 'thumbnail' | 'medium' | 'large';

// Define default dimensions for each size
export const IMAGE_SIZES: Record<ImageSize, ResizeOptions> = {
  thumbnail: {
    maxWidth: 200,
    maxHeight: 200,
    quality: 0.85,
  },
  medium: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.9,
  },
  large: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.92,
  },
};

/**
 * Resizes an image file to the specified dimensions while maintaining aspect ratio
 */
export const resizeImage = (file: File, options: ResizeOptions): Promise<File> => {
  const { maxWidth, maxHeight, quality = 0.9 } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      const aspectRatio = width / height;

      // Scale down if image is too large
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          width = Math.min(width, maxWidth);
          height = width / aspectRatio;
          // If height still exceeds maxHeight, adjust
          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        } else {
          height = Math.min(height, maxHeight);
          width = height * aspectRatio;
          // If width still exceeds maxWidth, adjust
          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to WebP blob
      // WebP provides better compression (25-35% smaller) while maintaining quality
      // All modern browsers (Chrome, Firefox, Safari 14+, Edge) support WebP
      const originalName = file.name.split('.')[0] || 'image';

      // Try WebP conversion first
      canvas.toBlob(
        (blob) => {
          // Verify blob exists and is actually WebP format
          if (blob && blob.type === 'image/webp') {
            // WebP conversion successful
            const fileName = `${originalName}.webp`;
            const resizedFile = new File([blob], fileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            // Fallback to JPEG if WebP is not supported (shouldn't happen in modern browsers)
            canvas.toBlob(
              (jpegBlob) => {
                if (jpegBlob) {
                  const fileName = `${originalName}.jpg`;
                  const resizedFile = new File([jpegBlob], fileName, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(resizedFile);
                } else {
                  reject(new Error('Failed to convert image to WebP or JPEG'));
                }
              },
              'image/jpeg',
              quality
            );
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Creates three versions of an image: thumbnail, medium, and large
 * Returns an object with the three resized files
 */
export const createImageVersions = async (originalFile: File): Promise<Record<ImageSize, File>> => {
  try {
    const [thumbnail, medium, large] = await Promise.all([
      resizeImage(originalFile, IMAGE_SIZES.thumbnail),
      resizeImage(originalFile, IMAGE_SIZES.medium),
      resizeImage(originalFile, IMAGE_SIZES.large),
    ]);

    return {
      thumbnail,
      medium,
      large,
    };
  } catch (error) {
    throw new Error(`Failed to create image versions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
