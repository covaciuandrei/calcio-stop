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
    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      const originalFile = files[i];
      // Validate file type
      if (!originalFile.type.startsWith('image/')) {
        onError('Please select image files only.');
        continue;
      }
      let fileToUpload = originalFile;
      let compressionInfo = '';
      try {
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
          } finally {
            setIsCompressing(false);
          }
        }
        // Final size check
        if (fileToUpload.size > 5 * 1024 * 1024) {
          onError(
            `File ${originalFile.name} is still too large after compression (${(fileToUpload.size / 1024 / 1024).toFixed(1)}MB)`
          );
          continue;
        }
        const fileExt = 'jpg';
        const fileName = `${productId}/${Date.now()}_${i}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, fileToUpload);
        if (uploadError) {
          onError(`Upload failed for ${originalFile.name}: ${uploadError.message}`);
          continue;
        }
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
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
          onError(`DB error for ${originalFile.name}: ${dbError.message}`);
          continue;
        }
        onImageUploaded(imageData);
      } catch (error) {
        onError(error instanceof Error ? error.message : `Failed to upload image ${originalFile.name}`);
      }
    }
    setIsUploading(false);
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
          multiple
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
