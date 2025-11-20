import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTeamsActions } from '../../stores';
import { Team } from '../../types';
import LeagueMultiPicker from '../leagues/LeagueMultiPicker';

interface Props {
  editingTeam: Team | null;
  setEditingTeam: React.Dispatch<React.SetStateAction<Team | null>>;
}

const EditTeamModal: React.FC<Props> = ({ editingTeam, setEditingTeam }) => {
  // Get store actions
  const { updateTeam } = useTeamsActions();
  const [name, setName] = useState(editingTeam?.name || '');
  const [selectedLeagueIds, setSelectedLeagueIds] = useState<string[]>(editingTeam?.leagues || []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update state when editingTeam changes
  React.useEffect(() => {
    if (editingTeam) {
      setName(editingTeam.name);
      setSelectedLeagueIds(editingTeam.leagues || []);
      setErrors({});
    }
  }, [editingTeam]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Team name cannot be empty';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (!editingTeam) return;

    updateTeam(editingTeam.id, {
      name: name.trim(),
      leagues: selectedLeagueIds,
    });
    setEditingTeam(null);
  };

  if (!editingTeam) return null;

  return createPortal(
    <div className="modal" onClick={() => setEditingTeam(null)}>
      <div
        className="modal-content"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Edit Team</h3>
        <form onSubmit={handleSaveEdit}>
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label>
              Team Name:
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: '' }));
                  }
                }}
              />
            </label>
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className={`form-group`}>
            <label>
              Leagues:
              <LeagueMultiPicker
                selectedLeagueIds={selectedLeagueIds}
                onLeaguesChange={setSelectedLeagueIds}
                placeholder="Select leagues (optional)"
              />
            </label>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <button type="button" onClick={() => setEditingTeam(null)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditTeamModal;
