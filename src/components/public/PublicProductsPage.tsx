import React from 'react';
import { useProductsList } from '../../stores';
import ProductsTableListCard from '../products/ProductsTableListCard';

const PublicProductsPage: React.FC = () => {
  const products = useProductsList();

  return (
    <div className="page-container public-mode">
      <ProductsTableListCard products={products} isReadOnly={true} showActions={false} />
    </div>
  );
};

export default PublicProductsPage;
