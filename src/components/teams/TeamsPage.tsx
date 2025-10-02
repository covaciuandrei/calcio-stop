import React from 'react';
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
    </div>
  );
};

export default TeamsPage;
