import React from 'react';
import LeaguesPage from '../leagues/LeaguesPage';
import AddNewTeamCard from './AddNewTeamCard';
import ArchivedTeamsCard from './ArchivedTeamsCard';
import TeamsTableListCard from './TeamsTableListCard';

const TeamsPage: React.FC = () => {
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
