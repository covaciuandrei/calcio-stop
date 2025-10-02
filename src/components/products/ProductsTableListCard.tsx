import React, { useState } from 'react';
import { useProductsActions, useProductsList } from '../../stores';
import { Product } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditProductModal from './EditProductModal';
import ProductsTableList from './ProductsTableList';

const ProductsTableListCard: React.FC = () => {
  // Get data and actions from stores
  const products = useProductsList();
  const { archiveProduct } = useProductsActions();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductsExpanded, setIsProductsExpanded] = useState(true);
  const [productsSearchTerm, setProductsSearchTerm] = useState('');

  const deleteProduct = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    archiveProduct(id);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  return (
    <>
      <div className="card">
        {products.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-orange ${styles.expandableHeader}`}
              onClick={() => setIsProductsExpanded(!isProductsExpanded)}
            >
              <span>Active Products ({products.length})</span>
              <span className={`${styles.expandIcon} ${isProductsExpanded ? styles.expanded : styles.collapsed}`}>
                ▼
              </span>
            </div>
            {!isProductsExpanded && (
              <div className={styles.collapsedContent}>There are {products.length} products available.</div>
            )}
            {isProductsExpanded && (
              <>
                <h3 className="card-section-header">Product List</h3>
                {products.length >= 2 && (
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
                    products={products}
                    onEdit={handleEditClick}
                    onDelete={deleteProduct}
                    searchTerm={productsSearchTerm}
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
