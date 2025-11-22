import React from 'react';
import { useRouteData } from '../../hooks/useRouteData';
import AddNewProductCard from './AddNewProductCard';
import ArchivedProductsCard from './ArchivedProductsCard';
import ProductsTableListCard from './ProductsTableListCard';
import SoldOutProductsCard from './SoldOutProductsCard';

const ProductsPage: React.FC = () => {
  // Load only the data needed for the products page
  useRouteData();

  return (
    <div style={{ paddingBottom: 'var(--space-8)' }}>
      {/* Add New Product Card */}
      <AddNewProductCard />

      {/* Products Table List Card */}
      <ProductsTableListCard />

      {/* Sold Out Products Card */}
      <SoldOutProductsCard />

      {/* Archived Products Card */}
      <ArchivedProductsCard />
    </div>
  );
};

export default ProductsPage;
