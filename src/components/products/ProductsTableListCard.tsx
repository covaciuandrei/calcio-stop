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
import { Product } from '../../types';
import { applyProductFilters } from '../../utils/productFilters';
import styles from '../shared/TableListCard.module.css';
import EditProductModal from './EditProductModal';
import ProductFilters, { ProductFiltersState } from './ProductFilters';
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

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductsExpanded, setIsProductsExpanded] = useState(true);
  const [productsSearchTerm, setProductsSearchTerm] = useState('');
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

  // Use prop products if provided, otherwise use store products
  const products = propProducts || storeProducts;

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
    return limit ? filtered.slice(0, limit) : filtered;
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
      priceMin: '',
      priceMax: '',
    });
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
            {!isReadOnly && (
              <ProductFilters products={products} onFiltersChange={handleFiltersChange} onReset={handleResetFilters} />
            )}
            {displayProducts.length >= 2 && !isReadOnly && (
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
