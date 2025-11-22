import React, { useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { BadgeImage } from '../../types';
import { createImageVersions } from '../../utils/imageResize';
import './BadgeImageUpload.css';

interface BadgeImageUploadProps {
  badgeId: string;
  onImageUploaded: (image: BadgeImage) => void;
  onError: (error: string) => void;
  onAllUploadsComplete?: () => void;
  disabled?: boolean;
}

const BadgeImageUpload: React.FC<BadgeImageUploadProps> = ({
  badgeId,
  onImageUploaded,
  onError,
  onAllUploadsComplete,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
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
      try {
        // Create three versions of the image (thumbnail, medium, large)
        setIsResizing(true);
        const imageVersions = await createImageVersions(originalFile);
        setIsResizing(false);

        const timestamp = Date.now();
        const fileExt = 'webp';

        // Upload all three versions
        const baseFileName = `${badgeId}/${timestamp}_${i}`;
        const thumbnailFileName = `${baseFileName}_thumbnail.${fileExt}`;
        const mediumFileName = `${baseFileName}_medium.${fileExt}`;
        const largeFileName = `${baseFileName}_large.${fileExt}`;

        // Upload thumbnail
        const { error: thumbnailUploadError } = await supabase.storage
          .from('badge-images')
          .upload(thumbnailFileName, imageVersions.thumbnail);
        if (thumbnailUploadError) {
          onError(`Upload failed for ${originalFile.name} (thumbnail): ${thumbnailUploadError.message}`);
          continue;
        }

        // Upload medium
        const { error: mediumUploadError } = await supabase.storage
          .from('badge-images')
          .upload(mediumFileName, imageVersions.medium);
        if (mediumUploadError) {
          onError(`Upload failed for ${originalFile.name} (medium): ${mediumUploadError.message}`);
          continue;
        }

        // Upload large
        const { error: largeUploadError } = await supabase.storage
          .from('badge-images')
          .upload(largeFileName, imageVersions.large);
        if (largeUploadError) {
          onError(`Upload failed for ${originalFile.name} (large): ${largeUploadError.message}`);
          continue;
        }

        // Get public URLs for all three versions
        const { data: thumbnailUrlData } = supabase.storage.from('badge-images').getPublicUrl(thumbnailFileName);
        const { data: mediumUrlData } = supabase.storage.from('badge-images').getPublicUrl(mediumFileName);
        const { data: largeUrlData } = supabase.storage.from('badge-images').getPublicUrl(largeFileName);

        // Insert into database with all three URLs
        // Using large_url as image_url for backwards compatibility
        const { data: imageData, error: dbError } = await supabase
          .from('badge_images')
          .insert({
            badge_id: badgeId,
            image_url: largeUrlData.publicUrl, // Legacy field, using large URL
            thumbnail_url: thumbnailUrlData.publicUrl,
            medium_url: mediumUrlData.publicUrl,
            large_url: largeUrlData.publicUrl,
            alt_text: originalFile.name,
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
    // Call completion callback after all uploads finish
    if (onAllUploadsComplete) {
      onAllUploadsComplete();
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
    <div className="badge-image-upload">
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

        {isUploading || isResizing ? (
          <div className="upload-content">
            <div className="upload-spinner"></div>
            <p>{isResizing ? 'Processing image...' : 'Uploading...'}</p>
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

export default BadgeImageUpload;
