import React, { useMemo, useState } from 'react';
import { useSalesActions, useSalesList } from '../../stores';
import { Sale } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditSaleModal from './EditSaleModal';
import SalesTableList from './SalesTableList';

const SalesTableListCard: React.FC = () => {
  // Get data and actions from stores
  const sales = useSalesList();
  const { deleteSale } = useSalesActions();
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [isSalesExpanded, setIsSalesExpanded] = useState(true);
  const [salesSearchTerm, setSalesSearchTerm] = useState('');

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

  const handleEditClick = (sale: Sale) => {
    setEditingSale(sale);
  };

  return (
    <>
      <div className="card">
        {sortedSales.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-orange ${styles.expandableHeader}`}
              onClick={() => setIsSalesExpanded(!isSalesExpanded)}
            >
              <span>Sales History ({sortedSales.length})</span>
              <span className={`${styles.expandIcon} ${isSalesExpanded ? styles.expanded : styles.collapsed}`}>▼</span>
            </div>
            {!isSalesExpanded && (
              <div className={styles.collapsedContent}>There are {sortedSales.length} sales recorded.</div>
            )}
            {isSalesExpanded && (
              <>
                <h3 className="card-section-header">Sales History</h3>
                {sortedSales.length >= 2 && (
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Search sales..."
                      value={salesSearchTerm}
                      onChange={(e) => setSalesSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                )}
                <div className={styles.tableContainer}>
                  <SalesTableList
                    sales={sortedSales}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                    searchTerm={salesSearchTerm}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-orange">
              <span>Sales History (0)</span>
            </div>
            <div className={styles.emptyState}>No sales recorded.</div>
          </>
        )}
      </div>

      <EditSaleModal editingSale={editingSale} setEditingSale={setEditingSale} />
    </>
  );
};

export default SalesTableListCard;
