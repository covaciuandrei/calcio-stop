import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useKitTypesList, useNamesetsActions } from '../../stores';
import { Nameset } from '../../types';
import { generateSeasons } from '../../utils/utils';
import KitTypePicker from '../kittypes/KitTypePicker';

interface Props {
  editingNameset: Nameset | null;
  setEditingNameset: React.Dispatch<React.SetStateAction<Nameset | null>>;
}

const EditNamesetModal: React.FC<Props> = ({ editingNameset, setEditingNameset }) => {
  // Get store actions and data
  const { updateNameset } = useNamesetsActions();
  const kitTypes = useKitTypesList();
  const [playerName, setPlayerName] = useState('');
  const [number, setNumber] = useState<number | ''>('');
  const [season, setSeason] = useState('2025/2026');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [selectedKitTypeId, setSelectedKitTypeId] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update state when editingNameset changes
  React.useEffect(() => {
    if (editingNameset) {
      setPlayerName(editingNameset.playerName || '');
      setNumber(editingNameset.number || '');
      setSeason(editingNameset.season || '2025/2026');
      setQuantity(editingNameset.quantity || '');
      setPrice(editingNameset.price || '');
      setSelectedKitTypeId(editingNameset.kitTypeId || (kitTypes.length > 0 ? kitTypes[0].id : ''));
      setErrors({});
    } else {
      // Reset form when modal is closed
      setPlayerName('');
      setNumber('');
      setSeason('2025/2026');
      setQuantity('');
      setPrice('');
      setSelectedKitTypeId(kitTypes.length > 0 ? kitTypes[0].id : '');
      setErrors({});
    }
  }, [editingNameset, kitTypes]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!playerName || !playerName.trim()) {
      newErrors.playerName = 'Player name cannot be empty';
    }
    if (number === '' || number < 1) {
      newErrors.number = 'Number must be positive';
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

    if (!editingNameset) return;

    updateNameset(editingNameset.id, {
      playerName: (playerName || '').trim(),
      number: Number(number),
      season: season || '2025/2026',
      quantity: Number(quantity),
      price: Number(price),
      kitTypeId: selectedKitTypeId,
    });
    setEditingNameset(null);
  };

  if (!editingNameset) return null;

  return createPortal(
    <div className="modal">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>Edit Nameset</h3>
        <form onSubmit={handleSaveEdit}>
          <div className={`form-group ${errors.playerName ? 'has-error' : ''}`}>
            <label>
              Player Name:
              <input
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  if (errors.playerName) {
                    setErrors((prev) => ({ ...prev, playerName: '' }));
                  }
                }}
              />
            </label>
            {errors.playerName && <div className="error-message">{errors.playerName}</div>}
          </div>
          <div className="form-group">
            <label>
              Kit Type:
              <KitTypePicker selectedKitTypeId={selectedKitTypeId} onKitTypeSelect={setSelectedKitTypeId} />
            </label>
          </div>
          <div className={`form-group ${errors.number ? 'has-error' : ''}`}>
            <label>
              Number:
              <input
                type="number"
                min={1}
                value={number}
                onChange={(e) => {
                  setNumber(parseInt(e.target.value) || '');
                  if (errors.number) {
                    setErrors((prev) => ({ ...prev, number: '' }));
                  }
                }}
              />
            </label>
            {errors.number && <div className="error-message">{errors.number}</div>}
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
              Price (RON):
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

          <div className="modal-buttons">
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <button type="button" onClick={() => setEditingNameset(null)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditNamesetModal;
