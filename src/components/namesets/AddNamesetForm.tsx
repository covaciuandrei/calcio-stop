import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Nameset } from '../../types';
import { generateSeasons } from '../../utils/utils';

interface Props {
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  onAdd?: (newNameset: Nameset) => void;
}

const AddNamesetForm: React.FC<Props> = ({ namesets, setNamesets, onAdd }) => {
  const [playerName, setPlayerName] = useState('');
  const [number, setNumber] = useState<number | ''>('');
  const [season, setSeason] = useState('2025/2026');
  const [quantity, setQuantity] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return alert('Player name cannot be empty');
    if (number === '' || number < 1) return alert('Number must be positive');
    if (quantity === '' || quantity < 0) return alert('Quantity must be 0 or greater');

    const newNameset: Nameset = {
      id: uuidv4(),
      playerName: playerName.trim(),
      number: Number(number),
      season,
      quantity: Number(quantity),
    };

    setNamesets([...namesets, newNameset]);
    if (onAdd) onAdd(newNameset);
    setPlayerName('');
    setNumber('');
    setSeason('2025/2026');
    setQuantity('');
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <div className="form-group">
        <label>Player Name</label>
        <input
          type="text"
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
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
        />
      </div>
      <div className="form-group">
        <label>Season</label>
        <select value={season} onChange={(e) => setSeason(e.target.value)}>
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
        />
      </div>
      <div className="form-button-container">
        <button type="submit" className="btn btn-success">
          Save
        </button>
      </div>
    </form>
  );
};

export default AddNamesetForm;
