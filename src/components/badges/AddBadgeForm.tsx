import React, { useState } from 'react';
import { useBadgesActions } from '../../stores';
import { Badge } from '../../types';
import { generateSeasons } from '../../utils/utils';

interface Props {
  onAdd?: (newBadge: Badge) => void;
}

const AddBadgeForm: React.FC<Props> = ({ onAdd }) => {
  // Get store actions
  const { addBadge } = useBadgesActions();
  const [name, setName] = useState('');
  const [season, setSeason] = useState('2025/2026');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Badge name cannot be empty';
    }
    if (quantity === '' || quantity < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const newBadge: Badge = {
      id: Date.now().toString(),
      name: name.trim(),
      season,
      quantity: Number(quantity),
      createdAt: new Date().toISOString(),
    };

    addBadge(newBadge);
    if (onAdd) onAdd(newBadge);
    setName('');
    setSeason('2025/2026');
    setQuantity('');
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
        <label>Badge Name</label>
        <input
          type="text"
          placeholder="e.g. Champions League"
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
      <div className="form-group">
        <label>Season</label>
        <select value={season} onChange={(e) => setSeason(e.target.value)}>
          {generateSeasons().map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className={`form-group ${errors.quantity ? 'has-error' : ''}`}>
        <label>Quantity</label>
        <input
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => {
            setQuantity(parseInt(e.target.value) || '');
            if (errors.quantity) {
              setErrors((prev) => ({ ...prev, quantity: '' }));
            }
          }}
        />
        {errors.quantity && <div className="error-message">{errors.quantity}</div>}
      </div>
      <div className="form-button-container">
        <button type="submit" className="btn btn-success">
          Add Badge
        </button>
      </div>
    </form>
  );
};

export default AddBadgeForm;
