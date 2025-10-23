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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Kit type name cannot be empty';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const newKitType: KitType = {
      id: uuidv4(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };

    addKitType(newKitType);
    if (onAdd) onAdd(newKitType);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
        <label>Kit Type Name</label>
        <input
          type="text"
          placeholder="Kit Type Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: '' }));
            }
          }}
          style={
            isInDropdown
              ? {
                  width: '100%',
                  height: 'calc(38px * 1.2)' /* Match picker height */,
                  padding: 'calc(6px * 1.2) 8px' /* 20% taller padding */,
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }
              : {}
          }
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
      </div>
      <div className="form-button-container">
        <button
          type="submit"
          className="btn btn-success"
          style={
            isInDropdown
              ? {
                  height: 'calc(38px * 1.2)' /* Match picker height */,
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
