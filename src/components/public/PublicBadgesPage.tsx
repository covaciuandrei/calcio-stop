import React from 'react';
import { useBadgesList } from '../../stores';
import BadgeTableListCard from '../badges/BadgeTableListCard';

const PublicBadgesPage: React.FC = () => {
  const badges = useBadgesList();

  return (
    <div className="page-container">
      <BadgeTableListCard badges={badges} isReadOnly={true} showActions={false} />
    </div>
  );
};

export default PublicBadgesPage;
