import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { ProductImage } from '../../types';
import './ProductImageManager.css';
import ProductImageUpload from './ProductImageUpload';

interface ProductImageManagerProps {
  productId: string;
  isAdmin?: boolean;
}

const ProductImageManager: React.FC<ProductImageManagerProps> = ({ productId, isAdmin = false }) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
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
        imageUrl: item.image_url,
        altText: item.alt_text,
        isPrimary: item.is_primary,
        displayOrder: item.display_order,
        createdAt: item.created_at,
      }));

      setImages(mappedImages);
    } catch (error) {
      console.error('Error loading images:', error);
      setError(error instanceof Error ? error.message : 'Failed to load images');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Load images for the product
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleImageUploaded = (newImage: any) => {
    // Map database response to frontend format
    const mappedImage: ProductImage = {
      id: newImage.id,
      productId: newImage.product_id,
      imageUrl: newImage.image_url,
      altText: newImage.alt_text,
      isPrimary: newImage.is_primary,
      displayOrder: newImage.display_order,
      createdAt: newImage.created_at,
    };

    setImages((prev) => [...prev, mappedImage]);
    setError(null);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const imageToDelete = images.find((img) => img.id === imageId);
      if (!imageToDelete) return;

      // Delete from storage
      const fileName = imageToDelete.imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('product-images').remove([`${productId}/${fileName}`]);
      }

      // Delete from database
      const { error } = await supabase.from('product_images').delete().eq('id', imageId);

      if (error) {
        throw error;
      }

      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete image');
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      // First, unset all primary flags
      await supabase.from('product_images').update({ is_primary: false }).eq('product_id', productId);

      // Then set the selected image as primary
      const { error } = await supabase.from('product_images').update({ is_primary: true }).eq('id', imageId);

      if (error) {
        throw error;
      }

      // Update local state
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        }))
      );
    } catch (error) {
      console.error('Error setting primary image:', error);
      setError(error instanceof Error ? error.message : 'Failed to set primary image');
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleImageModalClose = () => {
    setIsImageModalOpen(false);
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (loading) {
    return (
      <div className="product-image-manager">
        <div className="loading">Loading images...</div>
      </div>
    );
  }

  const primaryImage = images.find((img) => img.isPrimary) || images[0];

  return (
    <div className="product-image-manager">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="error-close">
            ×
          </button>
        </div>
      )}

      {images.length > 0 ? (
        <>
          {/* Main Image */}
          <div className="main-image-container">
            <img
              src={primaryImage?.imageUrl}
              alt={primaryImage?.altText || 'Product image'}
              className="main-product-image"
              onClick={() => handleImageClick(0)}
            />
            {isAdmin && (
              <div className="image-actions">
                <button
                  onClick={() => handleDeleteImage(primaryImage.id)}
                  className="btn btn-icon btn-danger"
                  title="Delete image"
                >
                  🗑️
                </button>
                {!primaryImage.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(primaryImage.id)}
                    className="btn btn-icon btn-primary"
                    title="Set as primary"
                  >
                    ⭐
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="thumbnail-images">
              {images.map((image, index) => (
                <div key={image.id} className="thumbnail-container">
                  <img
                    src={image.imageUrl}
                    alt={image.altText || 'Product image'}
                    className={`thumbnail-image ${index === 0 ? 'active' : ''}`}
                    onClick={() => handleImageClick(index)}
                  />
                  {isAdmin && (
                    <div className="thumbnail-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(image.id);
                        }}
                        className="btn btn-icon btn-danger btn-small"
                        title="Delete image"
                      >
                        🗑️
                      </button>
                      {!image.isPrimary && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetPrimary(image.id);
                          }}
                          className="btn btn-icon btn-primary btn-small"
                          title="Set as primary"
                        >
                          ⭐
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="no-images">
          <div className="no-images-icon">📷</div>
          <p>No images available</p>
        </div>
      )}

      {/* Upload Component for Admin */}
      {isAdmin && (
        <ProductImageUpload productId={productId} onImageUploaded={handleImageUploaded} onError={handleUploadError} />
      )}

      {/* Image Modal */}
      {isImageModalOpen && images.length > 0 && (
        <div className="image-modal-overlay" onClick={handleImageModalClose}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={handleImageModalClose}>
              ×
            </button>
            <button className="image-modal-prev" onClick={handlePreviousImage}>
              ‹
            </button>
            <img
              src={images[selectedImageIndex].imageUrl}
              alt={images[selectedImageIndex].altText || 'Product image'}
              className="image-modal-image"
            />
            <button className="image-modal-next" onClick={handleNextImage}>
              ›
            </button>
            {images.length > 1 && (
              <div className="image-modal-counter">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageManager;
