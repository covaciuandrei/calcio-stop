import React from 'react';
import { useRouteData } from '../../hooks/useRouteData';
import AddNewBadgeCard from './AddNewBadgeCard';
import ArchivedBadgesCard from './ArchivedBadgesCard';
import BadgeTableListCard from './BadgeTableListCard';
import SoldOutBadgesCard from './SoldOutBadgesCard';

const BadgesPage: React.FC = () => {
  // Load only the data needed for the badges page
  useRouteData();

  return (
    <div>
      {/* Add New Badge Card */}
      <AddNewBadgeCard />

      {/* Badge Table List Card */}
      <BadgeTableListCard />

      {/* Sold Out Badges Card */}
      <SoldOutBadgesCard />

      {/* Archived Badges Card */}
      <ArchivedBadgesCard />
    </div>
  );
};

export default BadgesPage;
