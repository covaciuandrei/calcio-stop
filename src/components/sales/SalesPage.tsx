import React from 'react';
import { useRouteData } from '../../hooks/useRouteData';
import AddNewSaleCard from './AddNewSaleCard';
import SalesTableListCard from './SalesTableListCard';

const SalesPage: React.FC = () => {
  // Load only the data needed for the sales page
  useRouteData();

  return (
    <div>
      {/* Add New Sale Card */}
      <AddNewSaleCard />

      {/* Sales Table List Card */}
      <SalesTableListCard />
    </div>
  );
};

export default SalesPage;
