import React, { useState } from 'react';
import { Nameset } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditNamesetModal from './EditNamesetModal';
import NamesetTableList from './NamesetTableList';

interface Props {
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  archivedNamesets: Nameset[];
  setArchivedNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
}

const NamesetsTableListCard: React.FC<Props> = ({ namesets, setNamesets, archivedNamesets, setArchivedNamesets }) => {
  const [editingNameset, setEditingNameset] = useState<Nameset | null>(null);
  const [isNamesetsExpanded, setIsNamesetsExpanded] = useState(true);
  const [namesetsSearchTerm, setNamesetsSearchTerm] = useState('');

  const handleArchive = (id: string) => {
    if (!window.confirm('Are you sure you want to archive this nameset?')) return;
    const namesetToArchive = namesets.find((n) => n.id === id);
    if (namesetToArchive) {
      setArchivedNamesets((prev) => [...prev, namesetToArchive]);
      setNamesets(namesets.filter((n) => n.id !== id));
    }
  };

  const handleEditClick = (n: Nameset) => {
    setEditingNameset(n);
  };

  return (
    <>
      <div className="card">
        {namesets.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-orange ${styles.expandableHeader}`}
              onClick={() => setIsNamesetsExpanded(!isNamesetsExpanded)}
            >
              <span>Active Namesets ({namesets.length})</span>
              <span className={`${styles.expandIcon} ${isNamesetsExpanded ? styles.expanded : styles.collapsed}`}>
                ▼
              </span>
            </div>
            {!isNamesetsExpanded && (
              <div className={styles.collapsedContent}>There are {namesets.length} namesets available.</div>
            )}
            {isNamesetsExpanded && (
              <>
                <h3 className="card-section-header">Active Namesets List</h3>
                {namesets.length >= 2 && (
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Search namesets..."
                      value={namesetsSearchTerm}
                      onChange={(e) => setNamesetsSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                )}
                <div className={styles.tableContainer}>
                  <NamesetTableList
                    namesets={namesets}
                    onEdit={handleEditClick}
                    onArchive={handleArchive}
                    searchTerm={namesetsSearchTerm}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-orange">
              <span>Active Namesets (0)</span>
            </div>
            <div className={styles.emptyState}>No active namesets available.</div>
          </>
        )}
      </div>

      <EditNamesetModal
        editingNameset={editingNameset}
        setEditingNameset={setEditingNameset}
        setNamesets={setNamesets}
      />
    </>
  );
};

export default NamesetsTableListCard;
