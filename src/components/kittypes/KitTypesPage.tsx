import React from 'react';
import { useRouteData } from '../../hooks/useRouteData';
import AddNewKitTypeCard from './AddNewKitTypeCard';
import ArchivedKitTypesCard from './ArchivedKitTypesCard';
import KitTypesTableListCard from './KitTypesTableListCard';

const KitTypesPage: React.FC = () => {
  // Load only the data needed for the kit types page
  useRouteData();

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
