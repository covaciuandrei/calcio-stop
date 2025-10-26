import React, { useState } from 'react';
import { useProductsActions, useProductsList } from '../../stores';
import { Product } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditProductModal from './EditProductModal';
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductsExpanded, setIsProductsExpanded] = useState(true);
  const [productsSearchTerm, setProductsSearchTerm] = useState('');

  // Use prop products if provided, otherwise use store products
  const products = propProducts || storeProducts;
  const displayProducts = limit ? products.slice(0, limit) : products;

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

  return (
    <>
      <div className="card">
        {displayProducts.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-orange ${!isReadOnly ? styles.expandableHeader : ''}`}
              onClick={!isReadOnly ? () => setIsProductsExpanded(!isProductsExpanded) : undefined}
            >
              <span>
                Active Products ({displayProducts.length}
                {limit && products.length > limit ? ` (showing ${limit})` : ''})
              </span>
              {!isReadOnly && (
                <span className={`${styles.expandIcon} ${isProductsExpanded ? styles.expanded : styles.collapsed}`}>
                  ▼
                </span>
              )}
            </div>
            {!isReadOnly && !isProductsExpanded && (
              <div className={styles.collapsedContent}>There are {displayProducts.length} products available.</div>
            )}
            {(isReadOnly || isProductsExpanded) && (
              <>
                <h3 className="card-section-header">Product List</h3>
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
                  <ProductsTableList
                    products={displayProducts}
                    onEdit={handleEditClick}
                    onDelete={deleteProduct}
                    searchTerm={productsSearchTerm}
                    isReadOnly={isReadOnly}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-orange">
              <span>Active Products (0)</span>
            </div>
            <div className={styles.emptyState}>No active products available.</div>
          </>
        )}
      </div>

      <EditProductModal editingProduct={editingProduct} setEditingProduct={setEditingProduct} />
    </>
  );
};

export default ProductsTableListCard;
