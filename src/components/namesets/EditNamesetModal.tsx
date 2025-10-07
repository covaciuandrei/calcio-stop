import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNamesetsActions } from '../../stores';
import { Nameset } from '../../types';
import { generateSeasons } from '../../utils/utils';
import KitTypePicker from '../kittypes/KitTypePicker';

interface Props {
  editingNameset: Nameset | null;
  setEditingNameset: React.Dispatch<React.SetStateAction<Nameset | null>>;
}

const EditNamesetModal: React.FC<Props> = ({ editingNameset, setEditingNameset }) => {
  // Get store actions
  const { updateNameset } = useNamesetsActions();
  const [playerName, setPlayerName] = useState(editingNameset?.playerName || '');
  const [number, setNumber] = useState<number | ''>(editingNameset?.number || '');
  const [season, setSeason] = useState(editingNameset?.season || '2025/2026');
  const [quantity, setQuantity] = useState<number | ''>(editingNameset?.quantity || '');
  const [selectedKitTypeId, setSelectedKitTypeId] = useState<string>(
    editingNameset?.kitTypeId || 'default-kit-type-1st'
  );

  // Update state when editingNameset changes
  React.useEffect(() => {
    if (editingNameset) {
      setPlayerName(editingNameset.playerName);
      setNumber(editingNameset.number);
      setSeason(editingNameset.season);
      setQuantity(editingNameset.quantity);
      setSelectedKitTypeId(editingNameset.kitTypeId);
    }
  }, [editingNameset]);

  const handleSaveEdit = () => {
    if (!playerName.trim()) return alert('Player name cannot be empty');
    if (number === '' || number < 1) return alert('Number must be positive');
    if (quantity === '' || quantity < 0) return alert('Quantity must be 0 or greater');

    if (!editingNameset) return;

    updateNameset(editingNameset.id, {
      playerName: playerName.trim(),
      number: Number(number),
      season,
      quantity: Number(quantity),
      kitTypeId: selectedKitTypeId,
    });
    setEditingNameset(null);
  };

  if (!editingNameset) return null;

  return createPortal(
    <div className="modal">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>Edit Nameset</h3>
        <label>
          Player Name:
          <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        </label>
        <label>
          Kit Type:
          <KitTypePicker selectedKitTypeId={selectedKitTypeId} onKitTypeSelect={setSelectedKitTypeId} />
        </label>
        <label>
          Number:
          <input type="number" min={1} value={number} onChange={(e) => setNumber(parseInt(e.target.value) || '')} />
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
          <button onClick={() => setEditingNameset(null)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditNamesetModal;
