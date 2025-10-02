import React from 'react';
import AddNewSaleCard from './AddNewSaleCard';
import SalesTableListCard from './SalesTableListCard';

const SalesPage: React.FC = () => {
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
