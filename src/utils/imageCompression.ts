// Image compression utility for reducing file sizes before upload

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

export const compressImage = (file: File, options: CompressionOptions = {}): Promise<File> => {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.8, maxSizeMB = 5 } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;

      // Scale down if image is too large
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;

        if (width > height) {
          width = Math.min(width, maxWidth);
          height = width / aspectRatio;
        } else {
          height = Math.min(height, maxHeight);
          width = height * aspectRatio;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      // Try different quality levels if file is still too large
      const tryCompress = (currentQuality: number): void => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const sizeMB = blob.size / (1024 * 1024);

              // If still too large and quality can be reduced further, try again
              if (sizeMB > maxSizeMB && currentQuality > 0.1) {
                tryCompress(currentQuality - 0.1);
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          currentQuality
        );
      };

      tryCompress(quality);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Helper function to get compression info
export const getCompressionInfo = (originalSize: number, compressedSize: number) => {
  const originalMB = (originalSize / 1024 / 1024).toFixed(1);
  const compressedMB = (compressedSize / 1024 / 1024).toFixed(1);
  const reductionPercent = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);

  return {
    originalMB: parseFloat(originalMB),
    compressedMB: parseFloat(compressedMB),
    reductionPercent: parseFloat(reductionPercent),
    text: `compressed from ${originalMB}MB to ${compressedMB}MB (${reductionPercent}% reduction)`,
  };
};
