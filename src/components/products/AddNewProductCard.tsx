import React from 'react';
import AddProductForm from './AddProductForm';

const AddNewProductCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Add New Product</span>
      </div>
      <div className="card-content">
        <AddProductForm />
      </div>
    </div>
  );
};

export default AddNewProductCard;
