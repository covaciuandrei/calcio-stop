import React, { useState } from 'react';
import { useSuppliersActions } from '../../stores';
import { Seller } from '../../types';
import ProductMultiPicker from '../products/ProductMultiPicker';

interface Props {
  onAdd?: (newSeller: Seller) => void;
}

const AddSellerForm: React.FC<Props> = ({ onAdd }) => {
  // Get store actions
  const { addSeller } = useSuppliersActions();
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [productIds, setProductIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Seller name cannot be empty';
    }

    if (websiteUrl && !isValidUrl(websiteUrl)) {
      newErrors.websiteUrl = 'Please enter a valid URL';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const newSeller: Omit<Seller, 'id' | 'createdAt'> = {
      name: name.trim(),
      websiteUrl: websiteUrl.trim() || undefined,
      specialNotes: specialNotes.trim() || undefined,
      productIds: productIds,
    };

    addSeller(newSeller);
    if (onAdd) {
      // Note: We can't get the actual created seller here, but the store will update
      // This callback is mainly for closing modals etc.
    }
    setName('');
    setWebsiteUrl('');
    setSpecialNotes('');
    setProductIds([]);
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
      <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
        <label>Seller Name</label>
        <input
          type="text"
          placeholder="e.g. Nike Store"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: '' }));
            }
          }}
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
      </div>
      <div className={`form-group ${errors.websiteUrl ? 'has-error' : ''}`}>
        <label>Website URL (optional)</label>
        <input
          type="text"
          placeholder="e.g. https://nike.com"
          value={websiteUrl}
          onChange={(e) => {
            setWebsiteUrl(e.target.value);
            if (errors.websiteUrl) {
              setErrors((prev) => ({ ...prev, websiteUrl: '' }));
            }
          }}
        />
        {errors.websiteUrl && <div className="error-message">{errors.websiteUrl}</div>}
      </div>
      <div className="form-group">
        <label>Special Notes (optional)</label>
        <textarea
          placeholder="e.g. Best prices in Q4, Contact: John Doe"
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          rows={3}
        />
      </div>
      <div className="form-group">
        <label>Products Available from Seller</label>
        <ProductMultiPicker selectedProductIds={productIds} onProductsChange={setProductIds} />
      </div>
      <div className="form-button-container">
        <button type="submit" className="btn btn-success">
          Add Seller
        </button>
      </div>
    </form>
  );
};

export default AddSellerForm;
