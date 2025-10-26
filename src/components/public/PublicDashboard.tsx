import React from 'react';
import { useBadgesList, useProductsList } from '../../stores';
import BadgeTableListCard from '../badges/BadgeTableListCard';
import ProductsTableListCard from '../products/ProductsTableListCard';

const PublicDashboard: React.FC = () => {
  const products = useProductsList();
  const badges = useBadgesList();

  return (
    <div className="page-container">
      <ProductsTableListCard products={products} isReadOnly={true} showActions={false} limit={10} />

      <BadgeTableListCard badges={badges} isReadOnly={true} showActions={false} limit={10} />
    </div>
  );
};

export default PublicDashboard;
