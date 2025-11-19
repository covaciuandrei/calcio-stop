import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSalesActions, useSalesFilters, useSalesList } from '../../stores';
import { Sale } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditSaleModal from './EditSaleModal';
import SalesFilters from './SalesFilters';
import SalesTableList from './SalesTableList';

const SalesTableListCard: React.FC = () => {
  // Get data and actions from stores
  const sales = useSalesList();
  const filters = useSalesFilters();
  const { deleteSale, reverseSale, loadSales, setFilters } = useSalesActions();
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [isSalesExpanded, setIsSalesExpanded] = useState(true);
  const [salesSearchTerm, setSalesSearchTerm] = useState('');

  // Load sales when filters change (with ref to prevent infinite loops)
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    const currentFilters = filtersRef.current;
    const hasValidDates = currentFilters.startDate && currentFilters.endDate;

    // Only load if we have valid date filters
    if (hasValidDates) {
      loadSales(currentFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.startDate, filters.endDate, filters.saleType]);

  // Sort sales by date descending (most recent first)
  const sortedSales = useMemo(() => {
    return [...sales].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }, [sales]);

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return;
    deleteSale(id);
    setSalesSearchTerm(''); // Clear search after action
  };

  const handleReverse = (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to reverse this sale? This will restore product quantities and remove the sale from history.'
      )
    )
      return;
    reverseSale(id);
    setSalesSearchTerm(''); // Clear search after action
  };

  const handleEditClick = (sale: Sale) => {
    setEditingSale(sale);
  };

  return (
    <>
      <div className="card">
        <div
          className={`card-header mini-header mini-header-orange ${styles.expandableHeader}`}
          onClick={() => setIsSalesExpanded(!isSalesExpanded)}
        >
          <span>Sales History ({sortedSales.length})</span>
          <span className={`${styles.expandIcon} ${isSalesExpanded ? styles.expanded : styles.collapsed}`}>▼</span>
        </div>
        {!isSalesExpanded && (
          <div className={styles.collapsedContent}>
            {sortedSales.length > 0
              ? `There are ${sortedSales.length} sales recorded.`
              : 'No sales found for the selected date range.'}
          </div>
        )}
        {isSalesExpanded && (
          <>
            <h3 className="card-section-header">Sales History</h3>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <SalesFilters
                startDate={filters.startDate || ''}
                endDate={filters.endDate || ''}
                saleType={filters.saleType || ''}
                onFiltersChange={(newFilters) => {
                  setFilters({
                    startDate: newFilters.startDate,
                    endDate: newFilters.endDate,
                    saleType: newFilters.saleType || undefined,
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
              {sortedSales.length >= 2 && (
                <div className={styles.searchContainer} style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                  <input
                    type="text"
                    placeholder="Search sales..."
                    value={salesSearchTerm}
                    onChange={(e) => setSalesSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              )}
            </div>
            {sortedSales.length > 0 ? (
              <div className={styles.tableContainer}>
                <SalesTableList
                  sales={sortedSales}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  onReverse={handleReverse}
                  searchTerm={salesSearchTerm}
                />
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No sales found for the selected date range.</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: 'var(--space-2)' }}>
                  Try adjusting the date range or sale type filter above.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <EditSaleModal editingSale={editingSale} setEditingSale={setEditingSale} />
    </>
  );
};

export default SalesTableListCard;
