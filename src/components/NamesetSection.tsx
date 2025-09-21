import React, { useState } from 'react';
import { Nameset } from '../types/types';
import { generateSeasons } from '../utils/utils';
import AddNamesetForm from './AddNamesetForm';
import NamesetTableList from './NamesetTableList';

interface Props {
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  archivedNamesets: Nameset[];
  setArchivedNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
}

const NamesetSection: React.FC<Props> = ({ namesets, setNamesets, archivedNamesets, setArchivedNamesets }) => {
  const [editingNameset, setEditingNameset] = useState<Nameset | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [number, setNumber] = useState<number | ''>('');
  const [season, setSeason] = useState('2025/2026');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [isNamesetsExpanded, setIsNamesetsExpanded] = useState(true);
  const [namesetsSearchTerm, setNamesetsSearchTerm] = useState('');

  const handleArchive = (id: string) => {
    if (!window.confirm('Are you sure you want to archive this nameset?')) return;
    const namesetToArchive = namesets.find((n) => n.id === id);
    if (namesetToArchive) {
      setArchivedNamesets((prev) => [...prev, namesetToArchive]);
      setNamesets(namesets.filter((n) => n.id !== id));
    }
  };

  const handleEditClick = (n: Nameset) => {
    setEditingNameset(n);
    setPlayerName(n.playerName);
    setNumber(n.number);
    setSeason(n.season);
    setQuantity(n.quantity);
  };

  const handleSaveEdit = () => {
    if (!playerName.trim()) return alert('Player name cannot be empty');
    if (number === '' || number < 1) return alert('Number must be positive');
    if (quantity === '' || quantity < 0) return alert('Quantity must be 0 or greater');

    setNamesets((prev) =>
      prev.map((n) =>
        n.id === editingNameset?.id
          ? {
              ...n,
              playerName: playerName.trim(),
              number: Number(number),
              season,
              quantity: Number(quantity),
            }
          : n
      )
    );
    setEditingNameset(null);
  };

  return (
    <div>
      {/* Add New Nameset Card */}
      <div className="card">
        <div className="card-header mini-header mini-header-green">
          <span>Add New Nameset</span>
        </div>
        <div className="card-content">
          <AddNamesetForm namesets={namesets} setNamesets={setNamesets} />
        </div>
      </div>

      {/* Namesets List Card */}
      <div className="card">
        {namesets.length > 0 ? (
          <>
            <div
              className="card-header mini-header mini-header-orange"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onClick={() => setIsNamesetsExpanded(!isNamesetsExpanded)}
            >
              <span>Active Namesets ({namesets.length})</span>
              <span style={{ fontSize: '12px' }}>{isNamesetsExpanded ? '▼' : '▶'}</span>
            </div>
            {!isNamesetsExpanded && (
              <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                There are {namesets.length} namesets available.
              </div>
            )}
            {isNamesetsExpanded && (
              <>
                <h3 className="card-section-header">Active Namesets List</h3>
                {namesets.length >= 2 && (
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Search namesets..."
                      value={namesetsSearchTerm}
                      onChange={(e) => setNamesetsSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                )}
                <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
                  <NamesetTableList
                    namesets={namesets}
                    onEdit={handleEditClick}
                    onArchive={handleArchive}
                    searchTerm={namesetsSearchTerm}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-orange">
              <span>Active Namesets (0)</span>
            </div>
            <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
              No active namesets available.
            </div>
          </>
        )}
      </div>

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
            <label>
              Quantity:
              <input
                type="number"
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || '')}
              />
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
