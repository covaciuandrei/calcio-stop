import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useBadgesActions } from '../../stores';
import { Badge } from '../../types';
import { generateSeasons } from '../../utils/utils';

interface Props {
  editingBadge: Badge | null;
  setEditingBadge: React.Dispatch<React.SetStateAction<Badge | null>>;
}

const EditBadgeModal: React.FC<Props> = ({ editingBadge, setEditingBadge }) => {
  // Get store actions
  const { updateBadge } = useBadgesActions();
  const [name, setName] = useState(editingBadge?.name || '');
  const [season, setSeason] = useState(editingBadge?.season || '2025/2026');
  const [quantity, setQuantity] = useState<number | ''>(editingBadge?.quantity || '');

  // Update state when editingBadge changes
  React.useEffect(() => {
    if (editingBadge) {
      setName(editingBadge.name);
      setSeason(editingBadge.season);
      setQuantity(editingBadge.quantity);
    }
  }, [editingBadge]);

  const handleSaveEdit = () => {
    if (!name.trim()) return alert('Badge name cannot be empty');
    if (quantity === '' || quantity < 0) return alert('Quantity must be 0 or greater');

    if (!editingBadge) return;

    updateBadge(editingBadge.id, {
      name: name.trim(),
      season,
      quantity: Number(quantity),
    });
    setEditingBadge(null);
  };

  if (!editingBadge) return null;

  return createPortal(
    <div className="modal">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>Edit Badge</h3>
        <label>
          Badge Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
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
        <label>
          Quantity:
          <input type="number" min={0} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || '')} />
        </label>

        <div className="modal-buttons">
          <button onClick={handleSaveEdit} className="btn btn-success">
            Save
          </button>
          <button onClick={() => setEditingBadge(null)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditBadgeModal;
