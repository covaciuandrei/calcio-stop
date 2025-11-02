import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLeaguesActions } from '../../stores';
import { League } from '../../types';

interface Props {
  editingLeague: League | null;
  setEditingLeague: React.Dispatch<React.SetStateAction<League | null>>;
}

const EditLeagueModal: React.FC<Props> = ({ editingLeague, setEditingLeague }) => {
  // Get store actions
  const { updateLeague } = useLeaguesActions();
  const [name, setName] = useState(editingLeague?.name || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update state when editingLeague changes
  React.useEffect(() => {
    if (editingLeague) {
      setName(editingLeague.name);
      setErrors({});
    }
  }, [editingLeague]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'League name cannot be empty';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (!editingLeague) return;

    updateLeague(editingLeague.id, {
      name: name.trim(),
    });
    setEditingLeague(null);
  };

  if (!editingLeague) return null;

  return createPortal(
    <div className="modal">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>Edit League</h3>
        <form onSubmit={handleSaveEdit}>
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label>
              League Name:
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
            <button type="button" onClick={() => setEditingLeague(null)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditLeagueModal;

