import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useKitTypesActions } from '../../stores';
import { KitType } from '../../types';

interface Props {
  onAdd?: (newKitType: KitType) => void;
  isInDropdown?: boolean;
}

const AddKitTypeForm: React.FC<Props> = ({ onAdd, isInDropdown = false }) => {
  // Get store actions
  const { addKitType } = useKitTypesActions();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Kit type name cannot be empty');

    const newKitType: KitType = {
      id: uuidv4(),
      name: name.trim(),
    };

    addKitType(newKitType);
    if (onAdd) onAdd(newKitType);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <div className="form-group">
        <label>Kit Type Name</label>
        <input
          type="text"
          placeholder="Kit Type Name"
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

export default AddKitTypeForm;
