import React from 'react';
import { useRouteData } from '../../hooks/useRouteData';
import LeaguesPage from '../leagues/LeaguesPage';
import AddNewTeamCard from './AddNewTeamCard';
import ArchivedTeamsCard from './ArchivedTeamsCard';
import TeamsTableListCard from './TeamsTableListCard';

const TeamsPage: React.FC = () => {
  // Load only the data needed for the teams page (includes leagues)
  useRouteData();

  return (
    <div>
      {/* Add New Team Card */}
      <AddNewTeamCard />

      {/* Teams Table List Card */}
      <TeamsTableListCard />

      {/* Archived Teams Card */}
      <ArchivedTeamsCard />

      {/* Leagues Manage Card */}
      <div style={{ marginTop: 'var(--space-5)' }}>
        <LeaguesPage />
      </div>
    </div>
  );
};

export default TeamsPage;
