import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTeamsActions } from '../../stores';
import { Team } from '../../types';

interface Props {
  onAdd?: (newTeam: Team) => void;
  isInDropdown?: boolean;
}

const AddTeamForm: React.FC<Props> = ({ onAdd, isInDropdown = false }) => {
  // Get store actions
  const { addTeam } = useTeamsActions();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Team name cannot be empty');

    const newTeam: Team = {
      id: uuidv4(),
      name: name.trim(),
    };

    addTeam(newTeam);
    if (onAdd) onAdd(newTeam);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <div className="form-group">
        <label>Team Name</label>
        <input
          type="text"
          placeholder="Team Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={
            isInDropdown
              ? {
                  width: '100%',
                  height: '32px',
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }
              : {}
          }
        />
      </div>
      <div className="form-button-container">
        <button
          type="submit"
          className="btn btn-success"
          style={
            isInDropdown
              ? {
                  height: '32px',
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

export default AddTeamForm;
