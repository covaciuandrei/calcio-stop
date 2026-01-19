import React, { useState } from 'react';
import { InventoryEntityType } from '../../types';
import InventoryHistoryModal from './InventoryHistoryModal';

interface Props {
  entityType: InventoryEntityType;
  entityId: string;
  entityName: string;
}

const InventoryHistoryButton: React.FC<Props> = ({ entityType, entityId, entityName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className="btn btn-sm btn-outline-secondary"
        style={{ marginLeft: '8px', fontSize: '0.8rem', padding: '2px 6px' }}
        title="View Inventory History"
      >
        <span role="img" aria-label="history">📜</span> History
      </button>

      {isModalOpen && (
        <InventoryHistoryModal
          entityType={entityType}
          entityId={entityId}
          entityName={entityName}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default InventoryHistoryButton;
