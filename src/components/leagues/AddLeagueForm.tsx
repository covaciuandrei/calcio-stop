import React, { useState } from 'react';
import { useLeaguesActions } from '../../stores';
import { League } from '../../types';

interface Props {
  onAdd?: (newLeague: League) => void;
}

const AddLeagueForm: React.FC<Props> = ({ onAdd }) => {
  // Get store actions
  const { addLeague } = useLeaguesActions();
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'League name cannot be empty';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const newLeague = await addLeague({
        name: name.trim(),
      });
      if (onAdd) onAdd(newLeague);
      setName('');
    } catch (error) {
      // Error is already handled by the store
      console.error('Error adding league:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
        <label>League Name</label>
        <input
          type="text"
          placeholder="e.g. Premier League, Champions League"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: '' }));
            }
          }}
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
      </div>
      <div className="form-button-container">
        <button type="submit" className="btn btn-success">
          Add League
        </button>
      </div>
    </form>
  );
};

export default AddLeagueForm;

