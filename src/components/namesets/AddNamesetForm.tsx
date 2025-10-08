import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNamesetsActions } from '../../stores';
import { Nameset } from '../../types';
import { generateSeasons } from '../../utils/utils';
import KitTypePicker from '../kittypes/KitTypePicker';

interface Props {
  onAdd?: (newNameset: Nameset) => void;
  isInDropdown?: boolean;
}

const AddNamesetForm: React.FC<Props> = ({ onAdd, isInDropdown = false }) => {
  // Get store actions
  const { addNameset } = useNamesetsActions();
  const [playerName, setPlayerName] = useState('');
  const [number, setNumber] = useState<number | ''>('');
  const [season, setSeason] = useState('2025/2026');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [selectedKitTypeId, setSelectedKitTypeId] = useState<string>('default-kit-type-1st');

  const handleSubmit = () => {
    if (!playerName.trim()) return alert('Player name cannot be empty');
    if (number === '' || number < 1) return alert('Number must be positive');
    if (quantity === '' || quantity < 0) return alert('Quantity must be 0 or greater');

    const newNameset: Nameset = {
      id: uuidv4(),
      playerName: playerName.trim(),
      number: Number(number),
      season,
      quantity: Number(quantity),
      kitTypeId: selectedKitTypeId,
      createdAt: new Date().toISOString(),
    };

    addNameset(newNameset);
    if (onAdd) onAdd(newNameset);
    setPlayerName('');
    setNumber('');
    setSeason('2025/2026');
    setQuantity('');
    setSelectedKitTypeId('default-kit-type-1st');
  };

  return (
    <div className="form-inline">
      <div className="form-group">
        <label>Player Name</label>
        <input
          type="text"
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
          style={
            isInDropdown
              ? {
                  width: '100%',
                  height: '32px',
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }
              : {}
          }
        />
      </div>
      <div className="form-group">
        <label>Number</label>
        <input
          type="number"
          placeholder="Number (positive)"
          min={1}
          value={number}
          onChange={(e) => setNumber(parseInt(e.target.value) || '')}
          required
          style={
            isInDropdown
              ? {
                  width: '100%',
                  height: '32px',
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }
              : {}
          }
        />
      </div>
      <div className="form-group">
        <label>Season</label>
        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          style={
            isInDropdown
              ? {
                  width: '100%',
                  height: '32px',
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }
              : {}
          }
        >
          {generateSeasons().map((s: string) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          placeholder="Available quantity"
          min={0}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || '')}
          required
          style={
            isInDropdown
              ? {
                  width: '100%',
                  height: '32px',
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }
              : {}
          }
        />
      </div>
      <div className="form-group">
        <label>Kit Type</label>
        <KitTypePicker selectedKitTypeId={selectedKitTypeId} onKitTypeSelect={setSelectedKitTypeId} />
      </div>
      <div className="form-button-container">
        <button
          onClick={handleSubmit}
          className="btn btn-success"
          style={
            isInDropdown
              ? {
                  height: '32px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  borderRadius: '4px',
                  border: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }
              : {}
          }
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddNamesetForm;
