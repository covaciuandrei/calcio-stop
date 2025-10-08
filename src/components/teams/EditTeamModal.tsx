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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update state when editingTeam changes
  React.useEffect(() => {
    if (editingTeam) {
      setName(editingTeam.name);
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
    });
    setEditingTeam(null);
  };

  if (!editingTeam) return null;

  return createPortal(
    <div className="modal">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
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
