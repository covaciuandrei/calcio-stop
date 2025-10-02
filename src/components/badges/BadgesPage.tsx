import React from 'react';
import AddNewBadgeCard from './AddNewBadgeCard';
import ArchivedBadgesCard from './ArchivedBadgesCard';
import BadgeTableListCard from './BadgeTableListCard';

const BadgesPage: React.FC = () => {
  return (
    <div>
      {/* Add New Badge Card */}
      <AddNewBadgeCard />

      {/* Badge Table List Card */}
      <BadgeTableListCard />

      {/* Archived Badges Card */}
      <ArchivedBadgesCard />
    </div>
  );
};

export default BadgesPage;
