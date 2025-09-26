import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Badge } from '../types/types';
import { generateSeasons } from '../utils/utils';
import AddBadgeForm from './AddBadgeForm';
import BadgeTableList from './BadgeTableList';

interface Props {
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  archivedBadges: Badge[];
  setArchivedBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
}

const BadgeSection: React.FC<Props> = ({ badges, setBadges, archivedBadges, setArchivedBadges }) => {
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [name, setName] = useState('');
  const [season, setSeason] = useState('2025/2026');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [isBadgesExpanded, setIsBadgesExpanded] = useState(true);
  const [badgesSearchTerm, setBadgesSearchTerm] = useState('');

  const handleArchive = (id: string) => {
    if (!window.confirm('Are you sure you want to archive this badge?')) return;
    const badgeToArchive = badges.find((b) => b.id === id);
    if (badgeToArchive) {
      setArchivedBadges((prev) => [...prev, badgeToArchive]);
      setBadges(badges.filter((b) => b.id !== id));
    }
  };

  const handleEditClick = (b: Badge) => {
    setEditingBadge(b);
    setName(b.name);
    setSeason(b.season);
    setQuantity(b.quantity);
  };

  const handleSaveEdit = () => {
    if (!name.trim()) return alert('Badge name cannot be empty');
    if (quantity === '' || quantity < 0) return alert('Quantity must be 0 or greater');

    setBadges((prev) =>
      prev.map((b) =>
        b.id === editingBadge?.id
          ? {
              ...b,
              name: name.trim(),
              season,
              quantity: Number(quantity),
            }
          : b
      )
    );
    setEditingBadge(null);
  };

  return (
    <div>
      {/* Add New Badge Card */}
      <div className="card">
        <div className="card-header mini-header mini-header-green">
          <span>Add New Badge</span>
        </div>
        <div className="card-content">
          <AddBadgeForm badges={badges} setBadges={setBadges} />
        </div>
      </div>

      {/* Badges List Card */}
      <div className="card">
        {badges.length > 0 ? (
          <>
            <div
              className="card-header mini-header mini-header-orange"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onClick={() => setIsBadgesExpanded(!isBadgesExpanded)}
            >
              <span>Active Badges ({badges.length})</span>
              <span style={{ fontSize: '12px' }}>{isBadgesExpanded ? '▼' : '▶'}</span>
            </div>
            {!isBadgesExpanded && (
              <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                There are {badges.length} badges available.
              </div>
            )}
            {isBadgesExpanded && (
              <>
                <h3 className="card-section-header">Active Badges List</h3>
                {badges.length >= 2 && (
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Search badges..."
                      value={badgesSearchTerm}
                      onChange={(e) => setBadgesSearchTerm(e.target.value)}
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
                  <BadgeTableList
                    badges={badges}
                    onEdit={handleEditClick}
                    onArchive={handleArchive}
                    searchTerm={badgesSearchTerm}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-orange">
              <span>Active Badges (0)</span>
            </div>
            <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
              No active badges available.
            </div>
          </>
        )}
      </div>

      {editingBadge &&
        createPortal(
          <div className="modal">
            <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
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
                <button onClick={() => setEditingBadge(null)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default BadgeSection;
