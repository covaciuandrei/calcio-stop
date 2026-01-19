import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useBadgesActions } from '../../stores';
import { Badge } from '../../types';
import { generateSeasons } from '../../utils/utils';

interface Props {
  editingBadge: Badge | null;
  setEditingBadge: React.Dispatch<React.SetStateAction<Badge | null>>;
  onSuccess?: () => void;
}

const EditBadgeModal: React.FC<Props> = ({ editingBadge, setEditingBadge, onSuccess }) => {
  // Get store actions
  const { updateBadge } = useBadgesActions();
  const [name, setName] = useState(editingBadge?.name || '');
  const [season, setSeason] = useState(editingBadge?.season || '2025/2026');
  const [quantity, setQuantity] = useState<number | ''>(editingBadge?.quantity || '');
  const [price, setPrice] = useState<number | ''>(editingBadge?.price || '');
  const [location, setLocation] = useState<string>(editingBadge?.location || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update state when editingBadge changes
  React.useEffect(() => {
    if (editingBadge) {
      setName(editingBadge.name);
      setSeason(editingBadge.season);
      setQuantity(editingBadge.quantity);
      setPrice(editingBadge.price);
      setLocation(editingBadge.location || '');
      setErrors({});
    }
  }, [editingBadge]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Badge name cannot be empty';
    }
    if (quantity === '' || quantity < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }
    if (price === '' || price < 0) {
      newErrors.price = 'Price must be 0 or greater';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (!editingBadge) return;

    updateBadge(editingBadge.id, {
      name: name.trim(),
      season,
      quantity: Number(quantity),
      price: Number(price),
      location: location.trim() || undefined,
    });
    setEditingBadge(null);
    if (onSuccess) onSuccess();
  };

  if (!editingBadge) return null;

  return createPortal(
    <div className="modal" onClick={() => setEditingBadge(null)}>
      <div
        className="modal-content"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Edit Badge</h3>
        <form onSubmit={handleSaveEdit}>
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label>
              Badge Name:
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
          <div className="form-group">
            <label>
              Season:
              <select value={season} onChange={(e) => setSeason(e.target.value)}>
                {generateSeasons().map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={`form-group ${errors.quantity ? 'has-error' : ''}`}>
            <label>
              Quantity:
              <input
                type="number"
                min={0}
                step={1}
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuantity(val === '' ? '' : parseInt(val, 10));
                  if (errors.quantity) {
                    setErrors((prev) => ({ ...prev, quantity: '' }));
                  }
                }}
              />
            </label>
            {errors.quantity && <div className="error-message">{errors.quantity}</div>}
          </div>
          <div className={`form-group ${errors.price ? 'has-error' : ''}`}>
            <label>
              Price:
              <input
                type="number"
                min={0}
                step={0.01}
                value={price}
                onChange={(e) => {
                  const val = e.target.value;
                  setPrice(val === '' ? '' : parseFloat(val));
                  if (errors.price) {
                    setErrors((prev) => ({ ...prev, price: '' }));
                  }
                }}
              />
            </label>
            {errors.price && <div className="error-message">{errors.price}</div>}
          </div>
          <div className="form-group">
            <label>
              Location (optional):
              <input
                type="text"
                placeholder="e.g. Warehouse A, Shelf 3"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <button type="button" onClick={() => setEditingBadge(null)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditBadgeModal;
