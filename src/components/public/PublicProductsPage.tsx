import React from 'react';
import { useAllProducts } from '../../stores';
import ProductsTableListCard from '../products/ProductsTableListCard';

const PublicProductsPage: React.FC = () => {
  const products = useAllProducts();

  return (
    <div className="public-mode">
      <ProductsTableListCard products={products} isReadOnly={true} showActions={false} />
    </div>
  );
};

export default PublicProductsPage;
