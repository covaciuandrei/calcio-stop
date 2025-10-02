import React from 'react';
import AddBadgeForm from './AddBadgeForm';

const AddNewBadgeCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Add New Badge</span>
      </div>
      <div className="card-content">
        <AddBadgeForm />
      </div>
    </div>
  );
};

export default AddNewBadgeCard;
