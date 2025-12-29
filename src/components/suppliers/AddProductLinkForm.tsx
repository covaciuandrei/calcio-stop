import React, { useState } from 'react';
import { useSellersList, useSuppliersActions } from '../../stores';
import { ProductLink } from '../../types';
import ProductPicker from '../products/ProductPicker';

interface Props {
  onAdd?: (newProductLink: ProductLink) => void;
}

const AddProductLinkForm: React.FC<Props> = ({ onAdd }) => {
  // Get store actions
  const { addProductLink } = useSuppliersActions();
  const sellers = useSellersList();
  const [productId, setProductId] = useState<string | null>(null);
  const [sellerId, setSellerId] = useState<string>('');
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

    const newProductLink: Omit<ProductLink, 'id' | 'createdAt'> = {
      productId: productId!,
      sellerId: sellerId || undefined,
      url: url.trim(),
      label: label.trim() || undefined,
    };

    addProductLink(newProductLink);
    if (onAdd) {
      // Note: We can't get the actual created product link here, but the store will update
    }
    setProductId(null);
    setSellerId('');
    setUrl('');
    setLabel('');
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <div className={`form-group ${errors.productId ? 'has-error' : ''}`}>
        <label>Product</label>
        <ProductPicker selectedProductId={productId} onProductSelect={setProductId} />
        {errors.productId && <div className="error-message">{errors.productId}</div>}
      </div>
      <div className="form-group">
        <label>Seller (optional)</label>
        <select value={sellerId} onChange={(e) => setSellerId(e.target.value)}>
          <option value="">None</option>
          {sellers.map((seller) => (
            <option key={seller.id} value={seller.id}>
              {seller.name}
            </option>
          ))}
        </select>
      </div>
      <div className={`form-group ${errors.url ? 'has-error' : ''}`}>
        <label>Link URL</label>
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
        {errors.url && <div className="error-message">{errors.url}</div>}
      </div>
      <div className="form-group">
        <label>Notes (optional)</label>
        <input type="text" placeholder="e.g. Official Store" value={label} onChange={(e) => setLabel(e.target.value)} />
      </div>
      <div className="form-button-container">
        <button type="submit" className="btn btn-success">
          Add Product Link
        </button>
      </div>
    </form>
  );
};

export default AddProductLinkForm;
