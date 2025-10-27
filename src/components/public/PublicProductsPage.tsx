import React, { useMemo, useState } from 'react';
import {
  useArchivedBadges,
  useArchivedKitTypes,
  useArchivedNamesets,
  useArchivedTeams,
  useBadgesList,
  useKitTypesList,
  useNamesetsList,
  useProductsList,
  useTeamsList,
} from '../../stores';
import { applyProductFilters } from '../../utils/productFilters';
import { getTeamInfo } from '../../utils/utils';
import ProductFilters, { ProductFiltersState } from '../products/ProductFilters';
import ProductsTableList from '../products/ProductsTableList';
import styles from '../shared/TableListCard.module.css';

const PublicProductsPage: React.FC = () => {
  const products = useProductsList();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ProductFiltersState>({
    team: '',
    type: '',
    kitType: '',
    sizes: [],
    season: '',
    player: '',
    number: '',
    badge: '',
    priceMin: '',
    priceMax: '',
  });

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    const filtered = applyProductFilters(
      products,
      filters,
      teams,
      archivedTeams,
      namesets,
      archivedNamesets,
      kitTypes,
      archivedKitTypes,
      badges,
      archivedBadges
    );
    return filtered;
  }, [
    products,
    filters,
    teams,
    archivedTeams,
    namesets,
    archivedNamesets,
    kitTypes,
    archivedKitTypes,
    badges,
    archivedBadges,
  ]);

  // Apply search term to filtered products
  const searchFilteredProducts = filteredProducts.filter((product) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const teamInfo = getTeamInfo(product.teamId, teams, archivedTeams);
    return (product.name || '').toLowerCase().includes(searchLower) || teamInfo.toLowerCase().includes(searchLower);
  });

  const handleFiltersChange = (newFilters: ProductFiltersState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      team: '',
      type: '',
      kitType: '',
      sizes: [],
      season: '',
      player: '',
      number: '',
      badge: '',
      priceMin: '',
      priceMax: '',
    });
  };

  return (
    <div className="page-container public-mode">
      <div className="card">
        <div className="card-header">
          <h2>
            Products ({searchFilteredProducts.length}
            {searchFilteredProducts.length !== products.length ? ` of ${products.length}` : ''})
          </h2>
        </div>
        <div className="card-content">
          {products.length > 0 && (
            <>
              <ProductFilters products={products} onFiltersChange={handleFiltersChange} onReset={handleResetFilters} />
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search by team or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              {searchFilteredProducts.length > 0 ? (
                <div className={styles.tableContainer}>
                  <ProductsTableList
                    products={searchFilteredProducts}
                    onEdit={() => {}} // Empty function since it's read-only
                    onDelete={() => {}} // Empty function since it's read-only
                    searchTerm={searchTerm}
                    isReadOnly={true}
                  />
                </div>
              ) : (
                <div className={styles.emptyState}>
                  No products found matching your filters and search. Try adjusting your search criteria or reset the
                  filters.
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
