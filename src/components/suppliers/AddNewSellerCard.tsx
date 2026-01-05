import React from 'react';
import CollapsibleCardWrapper from '../shared/CollapsibleCardWrapper';
import AddSellerForm from './AddSellerForm';

const AddNewSellerCard: React.FC = () => {
  return (
    <CollapsibleCardWrapper title="Add New Seller" headerColor="green" defaultExpanded={true}>
      <AddSellerForm />
    </CollapsibleCardWrapper>
  );
};

export default AddNewSellerCard;
