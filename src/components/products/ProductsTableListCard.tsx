import React, { useState } from 'react';
import { Nameset, Product, Team } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditProductModal from './EditProductModal';
import ProductsTableList from './ProductsTableList';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  archivedProducts: Product[];
  setArchivedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  archivedNamesets: Nameset[];
  setArchivedNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  archivedTeams: Team[];
  setArchivedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const ProductsTableListCard: React.FC<Props> = ({
  products,
  setProducts,
  archivedProducts,
  setArchivedProducts,
  namesets,
  setNamesets,
  archivedNamesets,
  setArchivedNamesets,
  teams,
  setTeams,
  archivedTeams,
  setArchivedTeams,
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductsExpanded, setIsProductsExpanded] = useState(true);
  const [productsSearchTerm, setProductsSearchTerm] = useState('');

  const deleteProduct = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const productToArchive = products.find((p) => p.id === id);
    if (productToArchive) {
      setArchivedProducts((prev) => [...prev, productToArchive]);
    }
    setProducts(products.filter((p) => p.id !== id));
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
                    namesets={namesets}
                    archivedNamesets={archivedNamesets}
                    teams={teams}
                    archivedTeams={archivedTeams}
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

      <EditProductModal
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        setProducts={setProducts}
        namesets={namesets}
        setNamesets={setNamesets}
        teams={teams}
        setTeams={setTeams}
      />
    </>
  );
};

export default ProductsTableListCard;
