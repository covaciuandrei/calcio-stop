import React from 'react';
import { useRouteData } from '../../hooks/useRouteData';
import AddNewLeagueCard from './AddNewLeagueCard';
import ArchivedLeaguesCard from './ArchivedLeaguesCard';
import LeaguesTableListCard from './LeaguesTableListCard';

const LeaguesPage: React.FC = () => {
  // Load only the data needed for the leagues page
  useRouteData();

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
