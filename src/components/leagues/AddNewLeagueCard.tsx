import React from 'react';
import AddLeagueForm from './AddLeagueForm';

const AddNewLeagueCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Add New League</span>
      </div>
      <div className="card-content">
        <AddLeagueForm />
      </div>
    </div>
  );
};

export default AddNewLeagueCard;

