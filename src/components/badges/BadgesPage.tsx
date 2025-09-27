import React from 'react';
import { Badge } from '../../types';
import AddNewBadgeCard from './AddNewBadgeCard';
import ArchivedBadgesCard from './ArchivedBadgesCard';
import BadgeTableListCard from './BadgeTableListCard';

interface Props {
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  archivedBadges: Badge[];
  setArchivedBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
}

const BadgesPage: React.FC<Props> = ({ badges, setBadges, archivedBadges, setArchivedBadges }) => {
  return (
    <div>
      {/* Add New Badge Card */}
      <AddNewBadgeCard badges={badges} setBadges={setBadges} />

      {/* Badge Table List Card */}
      <BadgeTableListCard
        badges={badges}
        setBadges={setBadges}
        archivedBadges={archivedBadges}
        setArchivedBadges={setArchivedBadges}
      />

      {/* Archived Badges Card */}
      <ArchivedBadgesCard
        badges={badges}
        setBadges={setBadges}
        archivedBadges={archivedBadges}
        setArchivedBadges={setArchivedBadges}
      />
    </div>
  );
};

export default BadgesPage;
