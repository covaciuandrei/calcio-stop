import React, { useMemo, useState } from 'react';
import {
  useArchivedBadges,
  useArchivedKitTypes,
  useArchivedNamesets,
  useArchivedTeams,
  useBadgesList,
  useKitTypesList,
  useNamesetsList,
  useProductsActions,
  useSoldOutProducts,
  useTeamsList,
} from '../../stores';
import { Product } from '../../types';
import { applyProductFilters } from '../../utils/productFilters';
import styles from '../shared/TableListCard.module.css';
import EditProductModal from './EditProductModal';
import ProductFilters, { ProductFiltersState } from './ProductFilters';
import ProductsTableList from './ProductsTableList';

interface SoldOutProductsCardProps {
  isReadOnly?: boolean;
  showActions?: boolean;
  limit?: number;
}

const SoldOutProductsCard: React.FC<SoldOutProductsCardProps> = ({ isReadOnly = false, showActions = true, limit }) => {
  // Get data and actions from stores
  const allProducts = useSoldOutProducts();

  // Memoize the sold-out products filtering to prevent infinite re-renders
  const soldOutProducts = useMemo(
    () => allProducts.filter((p) => p.sizes.every((s) => s.quantity === 0)),
    [allProducts]
  );
  const { archiveProduct } = useProductsActions();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSoldOutExpanded, setIsSoldOutExpanded] = useState(true);
  const [soldOutSearchTerm, setSoldOutSearchTerm] = useState('');
  const [filters, setFilters] = useState<ProductFiltersState>({
    team: '',
    type: '',
    kitType: '',
    sizes: [],
    season: '',
    player: '',
    number: '',
    badge: '',
    leagues: [],
    priceMin: '',
    priceMax: '',
  });

  // Apply filters to sold-out products
  const filteredSoldOutProducts = useMemo(() => {
    const filtered = applyProductFilters(
      soldOutProducts,
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
    return limit ? filtered.slice(0, limit) : filtered;
  }, [
    soldOutProducts,
    filters,
    teams,
    archivedTeams,
    namesets,
    archivedNamesets,
    kitTypes,
    archivedKitTypes,
    badges,
    archivedBadges,
    limit,
  ]);

  const displaySoldOutProducts = filteredSoldOutProducts;

  const deleteProduct = (id: string) => {
    if (!isReadOnly) {
      archiveProduct(id);
      setSoldOutSearchTerm(''); // Clear search after action
    }
  };

  const handleEditClick = (product: Product) => {
    if (!isReadOnly) {
      setEditingProduct(product);
    }
  };

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
      leagues: [],
      priceMin: '',
      priceMax: '',
    });
  };

  return (
    <>
      <div className="card" style={{ marginTop: 'var(--space-5)' }}>
        {soldOutProducts.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-red ${!isReadOnly ? styles.expandableHeader : ''}`}
              onClick={!isReadOnly ? () => setIsSoldOutExpanded(!isSoldOutExpanded) : undefined}
            >
              <span>
                SOLD OUT Products ({displaySoldOutProducts.length}
                {limit && soldOutProducts.length > limit ? ` (showing ${limit})` : ''}
                {displaySoldOutProducts.length !== soldOutProducts.length ? ` of ${soldOutProducts.length}` : ''})
              </span>
              {!isReadOnly && (
                <span className={`${styles.expandIcon} ${isSoldOutExpanded ? styles.expanded : styles.collapsed}`}>
                  ▼
                </span>
              )}
            </div>
            {!isReadOnly && !isSoldOutExpanded && (
              <div className={styles.collapsedContent}>
                There are {displaySoldOutProducts.length} sold out products
                {displaySoldOutProducts.length !== soldOutProducts.length ? ` (${soldOutProducts.length} total)` : ''}.
              </div>
            )}
            <div className={`${styles.collapsibleContent} ${!isSoldOutExpanded ? styles.collapsed : ''}`}>
              {isSoldOutExpanded && (
                <>
                  <h3 className="card-section-header">Sold Out Products List</h3>
                  <ProductFilters
                    products={soldOutProducts}
                    onFiltersChange={handleFiltersChange}
                    onReset={handleResetFilters}
                  />
                  {displaySoldOutProducts.length >= 2 && (
                    <div className={styles.searchContainer}>
                      <input
                        type="text"
                        placeholder="Search sold out products..."
                        value={soldOutSearchTerm}
                        onChange={(e) => setSoldOutSearchTerm(e.target.value)}
                        className={styles.searchInput}
                      />
                    </div>
                  )}
                  <div className={styles.tableContainer}>
                    <ProductsTableList
                      products={displaySoldOutProducts}
                      onEdit={handleEditClick}
                      onDelete={deleteProduct}
                      searchTerm={soldOutSearchTerm}
                      isReadOnly={isReadOnly}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-red">
              <span>SOLD OUT Products (0)</span>
            </div>
            <div className={styles.emptyState}>No sold out products available.</div>
          </>
        )}
      </div>

      <EditProductModal editingProduct={editingProduct} setEditingProduct={setEditingProduct} />
    </>
  );
};

export default SoldOutProductsCard;
