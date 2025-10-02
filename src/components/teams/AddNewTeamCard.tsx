import React from 'react';
import AddTeamForm from './AddTeamForm';

const AddNewTeamCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Add New Team</span>
      </div>
      <div className="card-content">
        <AddTeamForm />
      </div>
    </div>
  );
};

export default AddNewTeamCard;
