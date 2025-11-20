import React from 'react';
import AddProductLinkForm from './AddProductLinkForm';

const AddNewProductLinkCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Add New Product Link</span>
      </div>
      <div className="card-content">
        <AddProductLinkForm />
      </div>
    </div>
  );
};

export default AddNewProductLinkCard;
