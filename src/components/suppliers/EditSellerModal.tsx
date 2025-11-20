import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSuppliersActions } from '../../stores';
import { Seller } from '../../types';
import ProductMultiPicker from '../products/ProductMultiPicker';

interface Props {
  editingSeller: Seller | null;
  setEditingSeller: React.Dispatch<React.SetStateAction<Seller | null>>;
}

const EditSellerModal: React.FC<Props> = ({ editingSeller, setEditingSeller }) => {
  // Get store actions
  const { updateSeller } = useSuppliersActions();
  const [name, setName] = useState(editingSeller?.name || '');
  const [websiteUrl, setWebsiteUrl] = useState(editingSeller?.websiteUrl || '');
  const [specialNotes, setSpecialNotes] = useState(editingSeller?.specialNotes || '');
  const [productIds, setProductIds] = useState<string[]>(editingSeller?.productIds || []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update state when editingSeller changes
  useEffect(() => {
    if (editingSeller) {
      setName(editingSeller.name);
      setWebsiteUrl(editingSeller.websiteUrl || '');
      setSpecialNotes(editingSeller.specialNotes || '');
      setProductIds(editingSeller.productIds || []);
      setErrors({});
    }
  }, [editingSeller]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
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

    if (!editingSeller) return;

    updateSeller(editingSeller.id, {
      name: name.trim(),
      websiteUrl: websiteUrl.trim() || undefined,
      specialNotes: specialNotes.trim() || undefined,
      productIds: productIds,
    });
    setEditingSeller(null);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  if (!editingSeller) return null;

  return createPortal(
    <div className="modal" onClick={() => setEditingSeller(null)}>
      <div
        className="modal-content"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Edit Seller</h3>
        <form onSubmit={handleSaveEdit}>
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label>
              Seller Name:
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: '' }));
                  }
                }}
              />
            </label>
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          <div className={`form-group ${errors.websiteUrl ? 'has-error' : ''}`}>
            <label>
              Website URL (optional):
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
            </label>
            {errors.websiteUrl && <div className="error-message">{errors.websiteUrl}</div>}
          </div>
          <div className="form-group">
            <label>
              Special Notes (optional):
              <textarea
                placeholder="e.g. Best prices in Q4, Contact: John Doe"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                rows={3}
              />
            </label>
          </div>
          <div className="form-group">
            <label>Products Available from Seller:</label>
            <ProductMultiPicker selectedProductIds={productIds} onProductsChange={setProductIds} />
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <button type="button" onClick={() => setEditingSeller(null)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditSellerModal;
