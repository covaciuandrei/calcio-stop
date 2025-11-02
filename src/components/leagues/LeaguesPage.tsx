import React from 'react';
import AddNewLeagueCard from './AddNewLeagueCard';
import ArchivedLeaguesCard from './ArchivedLeaguesCard';
import LeaguesTableListCard from './LeaguesTableListCard';

const LeaguesPage: React.FC = () => {
  return (
    <div>
      {/* Add New League Card */}
      <AddNewLeagueCard />

      {/* Leagues Table List Card */}
      <LeaguesTableListCard />

      {/* Archived Leagues Card */}
      <ArchivedLeaguesCard />
    </div>
  );
};

export default LeaguesPage;

