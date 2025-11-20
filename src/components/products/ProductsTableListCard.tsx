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
  useProductsList,
  useTeamsList,
} from '../../stores';
import { useAuth } from '../../stores/authStore';
import { Product } from '../../types';
import { exportProductsToText } from '../../utils/productExport';
import { applyProductFilters } from '../../utils/productFilters';
import { SortOption, sortProducts } from '../../utils/productSort';
import { getBadgeInfo, getNamesetInfo, getTeamInfo } from '../../utils/utils';
import styles from '../shared/TableListCard.module.css';
import EditProductModal from './EditProductModal';
import ProductFilters, { ProductFiltersState } from './ProductFilters';
import './ProductFilters.css';
import ProductSort from './ProductSort';
import ProductsTableList from './ProductsTableList';

interface ProductsTableListCardProps {
  products?: Product[];
  isReadOnly?: boolean;
  showActions?: boolean;
  limit?: number;
}

const ProductsTableListCard: React.FC<ProductsTableListCardProps> = ({
  products: propProducts,
  isReadOnly = false,
  showActions = true,
  limit,
}) => {
  // Get data and actions from stores
  const storeProducts = useProductsList();
  const { archiveProduct } = useProductsActions();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin' && isAuthenticated;

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductsExpanded, setIsProductsExpanded] = useState(true);
  const [productsSearchTerm, setProductsSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc'); // Default to alphabetical sorting
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
    totalMin: '',
    totalMax: '',
    onSale: 'all',
  });

  // Use prop products if provided, otherwise use store products
  const products = propProducts || storeProducts;

  // Apply filters and sorting to products
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
    const sorted = sortProducts(
      filtered,
      sortOption,
      namesets,
      archivedNamesets,
      teams,
      archivedTeams,
      badges,
      archivedBadges,
      kitTypes,
      archivedKitTypes
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }, [
    products,
    filters,
    sortOption,
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

  const displayProducts = filteredProducts;

  const deleteProduct = (id: string) => {
    if (!isReadOnly) {
      archiveProduct(id);
      setProductsSearchTerm(''); // Clear search after action
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
      totalMin: '',
      totalMax: '',
      onSale: 'all',
    });
  };

  const handleExport = () => {
    // Apply search term filter to match what's visible in the table
    let productsToExport = displayProducts;
    if (productsSearchTerm.trim()) {
      productsToExport = displayProducts.filter((product) => {
        const teamInfo = getTeamInfo(product.teamId, teams, archivedTeams);
        const namesetInfo = getNamesetInfo(product.namesetId, namesets, archivedNamesets);
        const badgeInfo = getBadgeInfo(product.badgeId, badges, archivedBadges);
        return (
          product.name.toLowerCase().includes(productsSearchTerm.toLowerCase()) ||
          product.type.toLowerCase().includes(productsSearchTerm.toLowerCase()) ||
          teamInfo.toLowerCase().includes(productsSearchTerm.toLowerCase()) ||
          namesetInfo.playerName.toLowerCase().includes(productsSearchTerm.toLowerCase()) ||
          namesetInfo.season.toLowerCase().includes(productsSearchTerm.toLowerCase()) ||
          badgeInfo.toLowerCase().includes(productsSearchTerm.toLowerCase()) ||
          product.price.toString().includes(productsSearchTerm)
        );
      });
    }

    exportProductsToText(
      productsToExport,
      teams,
      archivedTeams,
      namesets,
      archivedNamesets,
      kitTypes,
      archivedKitTypes,
      badges,
      archivedBadges
    );
  };

  return (
    <>
      <div className="card">
        <div
          className={`card-header mini-header mini-header-orange ${!isReadOnly ? styles.expandableHeader : ''}`}
          onClick={!isReadOnly ? () => setIsProductsExpanded(!isProductsExpanded) : undefined}
        >
          <span>
            Active Products ({displayProducts.length}
            {limit && products.length > limit ? ` (showing ${limit})` : ''}
            {displayProducts.length !== products.length ? ` of ${products.length}` : ''})
          </span>
          {!isReadOnly && (
            <span className={`${styles.expandIcon} ${isProductsExpanded ? styles.expanded : styles.collapsed}`}>▼</span>
          )}
        </div>

        {!isReadOnly && !isProductsExpanded && (
          <div className={styles.collapsedContent}>
            There are {displayProducts.length} products available
            {displayProducts.length !== products.length ? ` (${products.length} total)` : ''}.
          </div>
        )}

        {(isReadOnly || isProductsExpanded) && (
          <>
            <h3 className="card-section-header">Product List</h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
              <ProductFilters products={products} onFiltersChange={handleFiltersChange} onReset={handleResetFilters} />
              <ProductSort onSortChange={setSortOption} />
              {isAdmin && !isReadOnly && displayProducts.length > 0 && (
                <div className="product-filters" style={{ marginTop: 0 }}>
                  <div className="filter-controls">
                    <button
                      onClick={handleExport}
                      className="filter-toggle-btn"
                      style={{ background: 'var(--primary-500)', color: 'white', borderColor: 'var(--primary-500)' }}
                      title="Export filtered products to text file"
                    >
                      Export ({displayProducts.length})
                    </button>
                  </div>
                </div>
              )}
            </div>
            {displayProducts.length >= 2 && (
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productsSearchTerm}
                  onChange={(e) => setProductsSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            )}
            <div className={styles.tableContainer}>
              {displayProducts.length > 0 ? (
                <ProductsTableList
                  products={displayProducts}
                  onEdit={handleEditClick}
                  onDelete={deleteProduct}
                  searchTerm={productsSearchTerm}
                  isReadOnly={isReadOnly}
                />
              ) : (
                <div className={styles.emptyState}>
                  No products found matching your filters. Try adjusting your search criteria or reset the filters.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <EditProductModal editingProduct={editingProduct} setEditingProduct={setEditingProduct} />
    </>
  );
};

export default ProductsTableListCard;
