import React, { useEffect } from 'react';
import { useSuppliersActions } from '../../stores';
import AddNewProductLinkCard from './AddNewProductLinkCard';
import AddNewSellerCard from './AddNewSellerCard';
import ArchivedSellersCard from './ArchivedSellersCard';
import ProductLinksTableListCard from './ProductLinksTableListCard';
import SellersTableListCard from './SellersTableListCard';

const SuppliersPage: React.FC = () => {
  const { loadSellers, loadArchivedSellers, loadProductLinks } = useSuppliersActions();

  useEffect(() => {
    // Load data when component mounts
    loadSellers();
    loadArchivedSellers();
    loadProductLinks();
  }, [loadSellers, loadArchivedSellers, loadProductLinks]);

  return (
    <div>
      {/* Manage Sellers Section */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        {/* Add New Seller Card */}
        <AddNewSellerCard />

        {/* Sellers Table List Card */}
        <SellersTableListCard />

        {/* Archived Sellers Card */}
        <ArchivedSellersCard />
      </div>

      {/* Manage Product Links Section */}
      <div>
        {/* Add New Product Link Card */}
        <AddNewProductLinkCard />

        {/* Product Links Table List Card */}
        <ProductLinksTableListCard />
      </div>
    </div>
  );
};

export default SuppliersPage;
