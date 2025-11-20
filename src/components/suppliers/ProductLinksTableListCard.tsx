import React, { useMemo, useState } from 'react';
import { useProductLinksList, useProductsList, useSellersList, useSuppliersActions } from '../../stores';
import { ProductLink } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditProductLinkModal from './EditProductLinkModal';
import ProductLinksTableList from './ProductLinksTableList';

interface ProductLinksTableListCardProps {
  productLinks?: ProductLink[];
  isReadOnly?: boolean;
  showActions?: boolean;
  limit?: number;
}

const ProductLinksTableListCard: React.FC<ProductLinksTableListCardProps> = ({
  productLinks: propProductLinks,
  isReadOnly = false,
  showActions = true,
  limit,
}) => {
  // Get data and actions from stores
  const storeProductLinks = useProductLinksList();
  const products = useProductsList();
  const sellers = useSellersList();
  const { deleteProductLink } = useSuppliersActions();
  const [editingProductLink, setEditingProductLink] = useState<ProductLink | null>(null);
  const [isProductLinksExpanded, setIsProductLinksExpanded] = useState(true);
  const [productLinksSearchTerm, setProductLinksSearchTerm] = useState('');

  // Use prop product links if provided, otherwise use store product links
  const productLinks = propProductLinks || storeProductLinks;

  // Sort product links by creation date (newest first)
  const sortedProductLinks = useMemo(() => {
    return [...productLinks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [productLinks]);

  const displayProductLinks = limit ? sortedProductLinks.slice(0, limit) : sortedProductLinks;

  const handleDelete = (id: string) => {
    if (!isReadOnly) {
      deleteProductLink(id);
      setProductLinksSearchTerm('');
    }
  };

  const handleEditClick = (pl: ProductLink) => {
    if (!isReadOnly) {
      setEditingProductLink(pl);
    }
  };

  return (
    <>
      <div className="card">
        {displayProductLinks.length > 0 ? (
          <>
            <div
              className={`card-header mini-header mini-header-blue ${!isReadOnly ? styles.expandableHeader : ''}`}
              onClick={!isReadOnly ? () => setIsProductLinksExpanded(!isProductLinksExpanded) : undefined}
            >
              <span>
                Product Links ({displayProductLinks.length}
                {limit && productLinks.length > limit ? ` (showing ${limit})` : ''})
              </span>
              {!isReadOnly && (
                <span className={`${styles.expandIcon} ${isProductLinksExpanded ? styles.expanded : styles.collapsed}`}>
                  ▼
                </span>
              )}
            </div>
            {!isReadOnly && !isProductLinksExpanded && (
              <div className={styles.collapsedContent}>
                There are {displayProductLinks.length} product links available.
              </div>
            )}
            {(isReadOnly || isProductLinksExpanded) && (
              <>
                <h3 className="card-section-header">Product Links List</h3>
                {displayProductLinks.length >= 2 && !isReadOnly && (
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Search product links..."
                      value={productLinksSearchTerm}
                      onChange={(e) => setProductLinksSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                )}
                <div className={styles.tableContainer}>
                  <ProductLinksTableList
                    productLinks={displayProductLinks}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                    searchTerm={productLinksSearchTerm}
                    isReadOnly={isReadOnly}
                    products={products}
                    sellers={sellers}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-blue">
              <span>Product Links (0)</span>
            </div>
            <div className={styles.emptyState}>No product links available.</div>
          </>
        )}
      </div>

      <EditProductLinkModal editingProductLink={editingProductLink} setEditingProductLink={setEditingProductLink} />
    </>
  );
};

export default ProductLinksTableListCard;
