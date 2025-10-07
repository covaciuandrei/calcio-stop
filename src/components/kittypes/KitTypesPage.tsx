import React from 'react';
import AddNewKitTypeCard from './AddNewKitTypeCard';
import ArchivedKitTypesCard from './ArchivedKitTypesCard';
import KitTypesTableListCard from './KitTypesTableListCard';

const KitTypesPage: React.FC = () => {
  return (
    <div>
      {/* Add New Kit Type Card */}
      <AddNewKitTypeCard />

      {/* Kit Types Table List Card */}
      <KitTypesTableListCard />

      {/* Archived Kit Types Card */}
      <ArchivedKitTypesCard />
    </div>
  );
};

export default KitTypesPage;
