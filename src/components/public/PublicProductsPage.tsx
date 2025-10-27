import React, { useState } from 'react';
import { useArchivedTeams, useProductsList, useTeamsList } from '../../stores';
import { getTeamInfo } from '../../utils/utils';
import ProductsTableList from '../products/ProductsTableList';
import styles from '../shared/TableListCard.module.css';

const PublicProductsPage: React.FC = () => {
  const products = useProductsList();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on search term for display count
  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();

    // Get team info for search
    const teamInfo = getTeamInfo(product.teamId, teams, archivedTeams);

    return (product.name || '').toLowerCase().includes(searchLower) || teamInfo.toLowerCase().includes(searchLower);
  });

  return (
    <div className="page-container public-mode">
      <div className="card">
        <div className="card-header">
          <h2>Products ({searchTerm ? `${filteredProducts.length} of ${products.length}` : products.length})</h2>
        </div>
        <div className="card-content">
          {products.length > 0 && (
            <>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search by team or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              {filteredProducts.length > 0 ? (
                <div className={styles.tableContainer}>
                  <ProductsTableList
                    products={products}
                    onEdit={() => {}} // Empty function since it's read-only
                    onDelete={() => {}} // Empty function since it's read-only
                    searchTerm={searchTerm}
                    isReadOnly={true}
                  />
                </div>
              ) : (
                <div className={styles.emptyState}>
                  No products found matching "{searchTerm}". Try searching by team name or product name.
                </div>
              )}
            </>
          )}
          {products.length === 0 && <div className={styles.emptyState}>No products available.</div>}
        </div>
      </div>
    </div>
  );
};

export default PublicProductsPage;
