import React from 'react';
import { Team } from '../types/types';
import AddNewTeamCard from './AddNewTeamCard';
import ArchivedTeamsCard from './ArchivedTeamsCard';
import TeamsTableListCard from './TeamsTableListCard';

interface Props {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  archivedTeams: Team[];
  setArchivedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const TeamsPage: React.FC<Props> = ({ teams, setTeams, archivedTeams, setArchivedTeams }) => {
  return (
    <div>
      {/* Add New Team Card */}
      <AddNewTeamCard teams={teams} setTeams={setTeams} />

      {/* Teams Table List Card */}
      <TeamsTableListCard
        teams={teams}
        setTeams={setTeams}
        archivedTeams={archivedTeams}
        setArchivedTeams={setArchivedTeams}
      />

      {/* Archived Teams Card */}
      <ArchivedTeamsCard
        teams={teams}
        setTeams={setTeams}
        archivedTeams={archivedTeams}
        setArchivedTeams={setArchivedTeams}
      />
    </div>
  );
};

export default TeamsPage;
