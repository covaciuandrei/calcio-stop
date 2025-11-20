import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSellersList, useSuppliersActions } from '../../stores';
import { ProductLink } from '../../types';
import ProductPicker from '../products/ProductPicker';

interface Props {
  editingProductLink: ProductLink | null;
  setEditingProductLink: React.Dispatch<React.SetStateAction<ProductLink | null>>;
}

const EditProductLinkModal: React.FC<Props> = ({ editingProductLink, setEditingProductLink }) => {
  // Get store actions
  const { updateProductLink } = useSuppliersActions();
  const sellers = useSellersList();
  const [productId, setProductId] = useState<string | null>(editingProductLink?.productId || null);
  const [sellerId, setSellerId] = useState(editingProductLink?.sellerId || '');
  const [url, setUrl] = useState(editingProductLink?.url || '');
  const [label, setLabel] = useState(editingProductLink?.label || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update state when editingProductLink changes
  useEffect(() => {
    if (editingProductLink) {
      setProductId(editingProductLink.productId);
      setSellerId(editingProductLink.sellerId || '');
      setUrl(editingProductLink.url);
      setLabel(editingProductLink.label || '');
      setErrors({});
    }
  }, [editingProductLink]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!productId) {
      newErrors.productId = 'Please select a product';
    }

    if (!url.trim()) {
      newErrors.url = 'URL cannot be empty';
    } else if (!isValidUrl(url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (!editingProductLink) return;

    updateProductLink(editingProductLink.id, {
      productId: productId!,
      sellerId: sellerId || undefined,
      url: url.trim(),
      label: label.trim() || undefined,
    });
    setEditingProductLink(null);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  if (!editingProductLink) return null;

  return createPortal(
    <div className="modal" onClick={() => setEditingProductLink(null)}>
      <div
        className="modal-content"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Edit Product Link</h3>
        <form onSubmit={handleSaveEdit}>
          <div className={`form-group ${errors.productId ? 'has-error' : ''}`}>
            <label>
              Product:
              <ProductPicker selectedProductId={productId} onProductSelect={setProductId} />
            </label>
            {errors.productId && <div className="error-message">{errors.productId}</div>}
          </div>
          <div className="form-group">
            <label>
              Seller (optional):
              <select value={sellerId} onChange={(e) => setSellerId(e.target.value)}>
                <option value="">None</option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={`form-group ${errors.url ? 'has-error' : ''}`}>
            <label>
              Link URL:
              <input
                type="text"
                placeholder="e.g. https://example.com/product"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (errors.url) {
                    setErrors((prev) => ({ ...prev, url: '' }));
                  }
                }}
              />
            </label>
            {errors.url && <div className="error-message">{errors.url}</div>}
          </div>
          <div className="form-group">
            <label>
              Label (optional):
              <input
                type="text"
                placeholder="e.g. Official Store"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </label>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <button type="button" onClick={() => setEditingProductLink(null)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditProductLinkModal;
