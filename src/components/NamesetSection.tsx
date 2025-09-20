import React, { useState } from 'react';
import { Nameset } from '../types/types';
import { generateSeasons } from '../utils/utils';
import AddNamesetForm from './AddNamesetForm';
import NamesetTableList from './NamesetTableList';

interface Props {
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
}

const NamesetSection: React.FC<Props> = ({ namesets, setNamesets }) => {
  const [editingNameset, setEditingNameset] = useState<Nameset | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [number, setNumber] = useState<number | ''>('');
  const [season, setSeason] = useState('2025/2026');

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this nameset?')) return;
    setNamesets(namesets.filter((n) => n.id !== id));
  };

  const handleEditClick = (n: Nameset) => {
    setEditingNameset(n);
    setPlayerName(n.playerName);
    setNumber(n.number);
    setSeason(n.season);
  };

  const handleSaveEdit = () => {
    if (!playerName.trim()) return alert('Player name cannot be empty');
    if (number === '' || number < 1) return alert('Number must be positive');

    setNamesets((prev) =>
      prev.map((n) =>
        n.id === editingNameset?.id
          ? {
              ...n,
              playerName: playerName.trim(),
              number: Number(number),
              season,
            }
          : n
      )
    );
    setEditingNameset(null);
  };

  return (
    <div>
      <div className="form-section">
        <h4>Add New Nameset</h4>
        <AddNamesetForm namesets={namesets} setNamesets={setNamesets} />
      </div>

      <NamesetTableList namesets={namesets} onEdit={handleEditClick} onDelete={handleDelete} />

      {editingNameset && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Nameset</h3>
            <label>
              Player Name:
              <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
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

            <div className="modal-buttons">
              <button onClick={handleSaveEdit} className="btn btn-success">
                Save
              </button>
              <button onClick={() => setEditingNameset(null)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NamesetSection;
