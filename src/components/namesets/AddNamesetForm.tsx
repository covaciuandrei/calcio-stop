import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useKitTypesList, useNamesetsActions } from '../../stores';
import { Nameset } from '../../types';
import { generateSeasons } from '../../utils/utils';
import KitTypePicker from '../kittypes/KitTypePicker';

interface Props {
  onAdd?: (newNameset: Nameset) => void;
  isInDropdown?: boolean;
}

const AddNamesetForm: React.FC<Props> = ({ onAdd, isInDropdown = false }) => {
  // Get store actions and data
  const { addNameset } = useNamesetsActions();
  const kitTypes = useKitTypesList();
  const [playerName, setPlayerName] = useState('');
  const [number, setNumber] = useState<number | ''>('');
  const [season, setSeason] = useState('2025/2026');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [selectedKitTypeId, setSelectedKitTypeId] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Set default kit type when kit types are loaded
  useEffect(() => {
    if (kitTypes.length > 0 && !selectedKitTypeId) {
      setSelectedKitTypeId(kitTypes[0].id);
    }
  }, [kitTypes, selectedKitTypeId]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newErrors: { [key: string]: string } = {};

    if (!playerName.trim()) {
      newErrors.playerName = 'Player name cannot be empty';
    }
    if (number === '' || number < 1) {
      newErrors.number = 'Number must be positive';
    }
    if (quantity === '' || quantity < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }
    if (!selectedKitTypeId) {
      newErrors.kitType = 'Please select a kit type';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

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
    setSelectedKitTypeId(kitTypes.length > 0 ? kitTypes[0].id : '');
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <div className={`form-group ${errors.playerName ? 'has-error' : ''}`}>
        <label>Player Name</label>
        <input
          type="text"
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
            if (errors.playerName) {
              setErrors((prev) => ({ ...prev, playerName: '' }));
            }
          }}
          style={
            isInDropdown
              ? {
                  width: '100%',
                  height: 'calc(38px * 1.2)' /* Match picker height */,
                  padding: 'calc(6px * 1.2) 8px' /* 20% taller padding */,
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }
              : {}
          }
        />
        {errors.playerName && <div className="error-message">{errors.playerName}</div>}
      </div>
      <div className={`form-group ${errors.number ? 'has-error' : ''}`}>
        <label>Number</label>
        <input
          type="number"
          placeholder="Number (positive)"
          min={1}
          value={number}
          onChange={(e) => {
            setNumber(parseInt(e.target.value) || '');
            if (errors.number) {
              setErrors((prev) => ({ ...prev, number: '' }));
            }
          }}
          style={
            isInDropdown
              ? {
                  width: '100%',
                  height: 'calc(38px * 1.2)' /* Match picker height */,
                  padding: 'calc(6px * 1.2) 8px' /* 20% taller padding */,
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }
              : {}
          }
        />
        {errors.number && <div className="error-message">{errors.number}</div>}
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
                  height: 'calc(38px * 1.2)' /* Match picker height */,
                  padding: 'calc(6px * 1.2) 8px' /* 20% taller padding */,
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
      <div className={`form-group ${errors.quantity ? 'has-error' : ''}`}>
        <label>Quantity</label>
        <input
          type="number"
          placeholder="Available quantity"
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
          style={
            isInDropdown
              ? {
                  width: '100%',
                  height: 'calc(38px * 1.2)' /* Match picker height */,
                  padding: 'calc(6px * 1.2) 8px' /* 20% taller padding */,
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }
              : {}
          }
        />
        {errors.quantity && <div className="error-message">{errors.quantity}</div>}
      </div>
      <div className={`form-group ${errors.kitType ? 'has-error' : ''}`}>
        <label>Kit Type</label>
        <KitTypePicker selectedKitTypeId={selectedKitTypeId} onKitTypeSelect={setSelectedKitTypeId} />
        {errors.kitType && <div className="error-message">{errors.kitType}</div>}
      </div>
      <div className="form-button-container">
        <button
          type="submit"
          className="btn btn-success"
          style={
            isInDropdown
              ? {
                  height: 'calc(38px * 1.2)' /* Match picker height */,
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
    </form>
  );
};

export default AddNamesetForm;
