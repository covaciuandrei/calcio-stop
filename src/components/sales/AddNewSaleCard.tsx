import React from 'react';
import AddSaleForm from './AddSaleForm';

const AddNewSaleCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Record New Sale</span>
      </div>
      <div className="card-content">
        <AddSaleForm />
      </div>
    </div>
  );
};

export default AddNewSaleCard;
