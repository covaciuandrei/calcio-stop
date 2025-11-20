import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useReturnsActions, useReturnsFilters, useReturnsList } from '../../stores';
import styles from '../shared/TableListCard.module.css';
import ReturnsFilters from './ReturnsFilters';
import ReturnsTableList from './ReturnsTableList';

const ReturnsTableListCard: React.FC = () => {
  // Get data and actions from stores
  const returns = useReturnsList();
  const filters = useReturnsFilters();
  const { deleteReturn, loadReturns, setFilters } = useReturnsActions();
  const [isReturnsExpanded, setIsReturnsExpanded] = useState(true);
  const [returnsSearchTerm, setReturnsSearchTerm] = useState('');

  // Load returns when filters change (with ref to prevent infinite loops)
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    const currentFilters = filtersRef.current;
    const hasValidDates = currentFilters.startDate && currentFilters.endDate;

    // Only load if we have valid date filters
    if (hasValidDates) {
      loadReturns(currentFilters);
    }
    // Intentional: loadReturns is stable and accessed via ref to prevent unnecessary re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.startDate, filters.endDate, filters.saleType]);

  // Sort returns by date descending (most recent first)
  const sortedReturns = useMemo(() => {
    return [...returns].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }, [returns]);

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this return?')) return;
    deleteReturn(id);
    setReturnsSearchTerm(''); // Clear search after action
  };

  return (
    <>
      <div className="card">
        <div
          className={`card-header mini-header mini-header-orange ${styles.expandableHeader}`}
          onClick={() => setIsReturnsExpanded(!isReturnsExpanded)}
        >
          <span>Returns History ({sortedReturns.length})</span>
          <span className={`${styles.expandIcon} ${isReturnsExpanded ? styles.expanded : styles.collapsed}`}>▼</span>
        </div>
        {!isReturnsExpanded && (
          <div className={styles.collapsedContent}>
            {sortedReturns.length > 0
              ? `There are ${sortedReturns.length} returns recorded.`
              : 'No returns found for the selected date range.'}
          </div>
        )}
        {isReturnsExpanded && (
          <>
            <h3 className="card-section-header">Returns History</h3>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <ReturnsFilters
                startDate={filters.startDate || ''}
                endDate={filters.endDate || ''}
                saleType={filters.saleType || ''}
                onFiltersChange={(newFilters) => {
                  setFilters({
                    startDate: newFilters.startDate,
                    endDate: newFilters.endDate,
                    saleType: newFilters.saleType === '' ? undefined : (newFilters.saleType as 'OLX' | 'IN-PERSON'),
                  });
                }}
                onReset={() => {
                  const now = new Date();
                  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                  setFilters({
                    startDate: startOfMonth.toISOString().split('T')[0],
                    endDate: endOfMonth.toISOString().split('T')[0],
                  });
                }}
              />
              {sortedReturns.length >= 2 && (
                <div className={styles.searchContainer} style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                  <input
                    type="text"
                    placeholder="Search returns..."
                    value={returnsSearchTerm}
                    onChange={(e) => setReturnsSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              )}
            </div>
            {sortedReturns.length > 0 ? (
              <div className={styles.tableContainer}>
                <ReturnsTableList returns={sortedReturns} onDelete={handleDelete} searchTerm={returnsSearchTerm} />
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No returns found for the selected date range.</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: 'var(--space-2)' }}>
                  Try adjusting the date range or sale type filter above.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ReturnsTableListCard;
