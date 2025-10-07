import React, { useState } from 'react';
import { useKitTypesActions, useKitTypesList, useKitTypesSearch, useSearchActions } from '../../stores';
import { KitType } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditKitTypeModal from './EditKitTypeModal';
import KitTypeTableList from './KitTypeTableList';

const KitTypesTableListCard: React.FC = () => {
  // Get data and actions from stores
  const kitTypes = useKitTypesList();
  const { archiveKitType } = useKitTypesActions();
  const kitTypesSearchTerm = useKitTypesSearch();
  const { setSearchTerm, clearSearchTerm } = useSearchActions();
  const [editingKitType, setEditingKitType] = useState<KitType | null>(null);
  const [isKitTypesExpanded, setIsKitTypesExpanded] = useState(true);

  const handleArchive = (id: string) => {
    archiveKitType(id);
    clearSearchTerm('kitTypes'); // Clear search after action
  };

  const handleEditClick = (kt: KitType) => {
    setEditingKitType(kt);
  };

  return (
    <>
      <div className="card">
        {kitTypes.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-orange ${styles.expandableHeader}`}
              onClick={() => setIsKitTypesExpanded(!isKitTypesExpanded)}
            >
              <span>Active Kit Types ({kitTypes.length})</span>
              <span className={`${styles.expandIcon} ${isKitTypesExpanded ? styles.expanded : styles.collapsed}`}>
                ▼
              </span>
            </div>
            {!isKitTypesExpanded && (
              <div className={styles.collapsedContent}>There are {kitTypes.length} kit types available.</div>
            )}
            {isKitTypesExpanded && (
              <>
                <h3 className="card-section-header">Active Kit Types List</h3>
                {kitTypes.length >= 2 && (
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Search kit types..."
                      value={kitTypesSearchTerm}
                      onChange={(e) => setSearchTerm('kitTypes', e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                )}
                <div className={styles.tableContainer}>
                  <KitTypeTableList
                    kitTypes={kitTypes}
                    onEdit={handleEditClick}
                    onArchive={handleArchive}
                    searchTerm={kitTypesSearchTerm}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-orange">
              <span>Active Kit Types (0)</span>
            </div>
            <div className={styles.emptyState}>No active kit types available.</div>
          </>
        )}
      </div>

      <EditKitTypeModal editingKitType={editingKitType} setEditingKitType={setEditingKitType} />
    </>
  );
};

export default KitTypesTableListCard;
