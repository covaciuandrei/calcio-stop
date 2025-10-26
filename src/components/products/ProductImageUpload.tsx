import React, { useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { ProductImage } from '../../types';
import { compressImage, getCompressionInfo } from '../../utils/imageCompression';
import './ProductImageUpload.css';

interface ProductImageUploadProps {
  productId: string;
  onImageUploaded: (image: ProductImage) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  productId,
  onImageUploaded,
  onError,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const originalFile = files[0];

    // Validate file type
    if (!originalFile.type.startsWith('image/')) {
      onError('Please select an image file');
      return;
    }

    setIsUploading(true);

    try {
      let fileToUpload = originalFile;
      let compressionInfo = '';

      // Compress image if it's larger than 1MB
      if (originalFile.size > 1024 * 1024) {
        setIsCompressing(true);
        try {
          fileToUpload = await compressImage(originalFile, {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 0.8,
            maxSizeMB: 5,
          });

          const compressionData = getCompressionInfo(originalFile.size, fileToUpload.size);
          compressionInfo = ` (${compressionData.text})`;
        } catch (compressionError) {
          console.warn('Image compression failed, using original file:', compressionError);
          // If compression fails, try with original file
        } finally {
          setIsCompressing(false);
        }
      }

      // Final size check (after compression)
      if (fileToUpload.size > 5 * 1024 * 1024) {
        onError(
          `File is still too large after compression (${(fileToUpload.size / 1024 / 1024).toFixed(1)}MB). Please try a smaller image.`
        );
        return;
      }

      // Generate unique filename
      const fileExt = 'jpg'; // Always use jpg after compression
      const fileName = `${productId}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, fileToUpload);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);

      // Save image record to database
      const { data: imageData, error: dbError } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: urlData.publicUrl,
          alt_text: originalFile.name + compressionInfo,
          is_primary: false,
          display_order: 0,
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      onImageUploaded(imageData);
    } catch (error) {
      console.error('Error uploading image:', error);
      onError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="product-image-upload">
      <div
        className={`upload-area ${dragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
          disabled={disabled}
        />

        {isUploading || isCompressing ? (
          <div className="upload-content">
            <div className="upload-spinner"></div>
            <p>{isCompressing ? 'Compressing image...' : 'Uploading...'}</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📷</div>
            <p>Click to upload or drag and drop</p>
            <p className="upload-hint">PNG, JPG, GIF (auto-compressed if needed)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageUpload;
