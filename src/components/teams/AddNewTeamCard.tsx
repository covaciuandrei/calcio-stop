import React from 'react';
import { Team } from '../../types';
import AddTeamForm from './AddTeamForm';

interface Props {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const AddNewTeamCard: React.FC<Props> = ({ teams, setTeams }) => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Add New Team</span>
      </div>
      <div className="card-content">
        <AddTeamForm teams={teams} setTeams={setTeams} />
      </div>
    </div>
  );
};

export default AddNewTeamCard;
