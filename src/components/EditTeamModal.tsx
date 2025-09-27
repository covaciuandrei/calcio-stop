import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Team } from '../types/types';

interface Props {
  editingTeam: Team | null;
  setEditingTeam: React.Dispatch<React.SetStateAction<Team | null>>;
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const EditTeamModal: React.FC<Props> = ({ editingTeam, setEditingTeam, setTeams }) => {
  const [name, setName] = useState(editingTeam?.name || '');

  // Update state when editingTeam changes
  React.useEffect(() => {
    if (editingTeam) {
      setName(editingTeam.name);
    }
  }, [editingTeam]);

  const handleSaveEdit = () => {
    if (!name.trim()) return alert('Team name cannot be empty');

    setTeams((prev) =>
      prev.map((t) =>
        t.id === editingTeam?.id
          ? {
              ...t,
              name: name.trim(),
            }
          : t
      )
    );
    setEditingTeam(null);
  };

  if (!editingTeam) return null;

  return createPortal(
    <div className="modal">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>Edit Team</h3>
        <label>
          Team Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <div className="modal-buttons">
          <button onClick={handleSaveEdit} className="btn btn-success">
            Save
          </button>
          <button onClick={() => setEditingTeam(null)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditTeamModal;
