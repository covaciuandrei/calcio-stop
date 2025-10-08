import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useKitTypesActions } from '../../stores';
import { KitType } from '../../types';

interface Props {
  editingKitType: KitType | null;
  setEditingKitType: React.Dispatch<React.SetStateAction<KitType | null>>;
}

const EditKitTypeModal: React.FC<Props> = ({ editingKitType, setEditingKitType }) => {
  // Get store actions
  const { updateKitType } = useKitTypesActions();
  const [name, setName] = useState(editingKitType?.name || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update state when editingKitType changes
  React.useEffect(() => {
    if (editingKitType) {
      setName(editingKitType.name);
      setErrors({});
    }
  }, [editingKitType]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Kit type name cannot be empty';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (!editingKitType) return;

    updateKitType(editingKitType.id, {
      name: name.trim(),
    });
    setEditingKitType(null);
  };

  if (!editingKitType) return null;

  return createPortal(
    <div className="modal">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>Edit Kit Type</h3>
        <form onSubmit={handleSaveEdit}>
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label>
              Kit Type Name:
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
            <button type="button" onClick={() => setEditingKitType(null)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditKitTypeModal;
