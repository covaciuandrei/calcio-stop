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

  // Update state when editingKitType changes
  React.useEffect(() => {
    if (editingKitType) {
      setName(editingKitType.name);
    }
  }, [editingKitType]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
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
          <label>
            Kit Type Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

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
