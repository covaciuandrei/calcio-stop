import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTeamsActions } from '../../stores';
import { Team } from '../../types';

interface Props {
  editingTeam: Team | null;
  setEditingTeam: React.Dispatch<React.SetStateAction<Team | null>>;
}

const EditTeamModal: React.FC<Props> = ({ editingTeam, setEditingTeam }) => {
  // Get store actions
  const { updateTeam } = useTeamsActions();
  const [name, setName] = useState(editingTeam?.name || '');

  // Update state when editingTeam changes
  React.useEffect(() => {
    if (editingTeam) {
      setName(editingTeam.name);
    }
  }, [editingTeam]);

  const handleSaveEdit = () => {
    if (!name.trim()) return alert('Team name cannot be empty');
    if (!editingTeam) return;

    updateTeam(editingTeam.id, {
      name: name.trim(),
    });
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
