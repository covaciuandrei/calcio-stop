import React from 'react';
import AddNamesetForm from './AddNamesetForm';

const AddNewNamesetCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Add New Nameset</span>
      </div>
      <div className="card-content">
        <AddNamesetForm />
      </div>
    </div>
  );
};

export default AddNewNamesetCard;
