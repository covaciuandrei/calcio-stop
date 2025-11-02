import React, { useMemo, useState } from 'react';
import { useKitTypesActions, useKitTypesList, useKitTypesSearch, useSearchActions } from '../../stores';
import { KitType } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditKitTypeModal from './EditKitTypeModal';
import KitTypeTableList from './KitTypeTableList';

interface KitTypesTableListCardProps {
  kitTypes?: KitType[];
  isReadOnly?: boolean;
  showActions?: boolean;
  limit?: number;
}

const KitTypesTableListCard: React.FC<KitTypesTableListCardProps> = ({
  kitTypes: propKitTypes,
  isReadOnly = false,
  showActions = true,
  limit,
}) => {
  // Get data and actions from stores
  const storeKitTypes = useKitTypesList();
  const { archiveKitType } = useKitTypesActions();
  const kitTypesSearchTerm = useKitTypesSearch();
  const { setSearchTerm, clearSearchTerm } = useSearchActions();
  const [editingKitType, setEditingKitType] = useState<KitType | null>(null);
  const [isKitTypesExpanded, setIsKitTypesExpanded] = useState(true);

  // Use prop kitTypes if provided, otherwise use store kitTypes
  const kitTypes = propKitTypes || storeKitTypes;
  
  // Sort kitTypes alphabetically by name
  const sortedKitTypes = useMemo(() => {
    return [...kitTypes].sort((a, b) => a.name.localeCompare(b.name));
  }, [kitTypes]);
  
  const displayKitTypes = limit ? sortedKitTypes.slice(0, limit) : sortedKitTypes;

  const handleArchive = (id: string) => {
    if (!isReadOnly) {
      archiveKitType(id);
      clearSearchTerm('kitTypes'); // Clear search after action
    }
  };

  const handleEditClick = (kt: KitType) => {
    if (!isReadOnly) {
      setEditingKitType(kt);
    }
  };

  return (
    <>
      <div className="card">
        {displayKitTypes.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-orange ${!isReadOnly ? styles.expandableHeader : ''}`}
              onClick={!isReadOnly ? () => setIsKitTypesExpanded(!isKitTypesExpanded) : undefined}
            >
              <span>
                Active Kit Types ({displayKitTypes.length}
                {limit ? ` (showing ${limit})` : ''})
              </span>
              {!isReadOnly && (
                <span className={`${styles.expandIcon} ${isKitTypesExpanded ? styles.expanded : styles.collapsed}`}>
                  ▼
                </span>
              )}
            </div>
            {!isReadOnly && !isKitTypesExpanded && (
              <div className={styles.collapsedContent}>There are {displayKitTypes.length} kit types available.</div>
            )}
            {(isReadOnly || isKitTypesExpanded) && (
              <>
                <h3 className="card-section-header">Active Kit Types List</h3>
                {displayKitTypes.length >= 2 && !isReadOnly && (
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
                    kitTypes={displayKitTypes}
                    onEdit={handleEditClick}
                    onArchive={handleArchive}
                    searchTerm={kitTypesSearchTerm}
                    isReadOnly={isReadOnly}
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
