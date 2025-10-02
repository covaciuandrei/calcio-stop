import React from 'react';
import AddNewProductCard from './AddNewProductCard';
import ArchivedProductsCard from './ArchivedProductsCard';
import ProductsTableListCard from './ProductsTableListCard';

const ProductsPage: React.FC = () => {
  return (
    <div>
      {/* Add New Product Card */}
      <AddNewProductCard />

      {/* Products Table List Card */}
      <ProductsTableListCard />

      {/* Archived Products Card */}
      <ArchivedProductsCard />
    </div>
  );
};

export default ProductsPage;
