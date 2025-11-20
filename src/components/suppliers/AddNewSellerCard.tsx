import React from 'react';
import AddSellerForm from './AddSellerForm';

const AddNewSellerCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Add New Seller</span>
      </div>
      <div className="card-content">
        <AddSellerForm />
      </div>
    </div>
  );
};

export default AddNewSellerCard;
