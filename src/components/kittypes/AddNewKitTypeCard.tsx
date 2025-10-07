import React from 'react';
import AddKitTypeForm from './AddKitTypeForm';

const AddNewKitTypeCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Add New Kit Type</span>
      </div>
      <div className="card-content">
        <AddKitTypeForm />
      </div>
    </div>
  );
};

export default AddNewKitTypeCard;
