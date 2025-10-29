import React from 'react';
import AddOrderForm from './AddOrderForm';

const AddNewOrderCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Add New Order</span>
      </div>
      <div className="card-content">
        <AddOrderForm />
      </div>
    </div>
  );
};

export default AddNewOrderCard;
