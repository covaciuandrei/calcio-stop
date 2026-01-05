import React from 'react';
import CollapsibleCardWrapper from '../shared/CollapsibleCardWrapper';
import AddProductForm from './AddProductForm';

const AddNewProductCard: React.FC = () => {
  return (
    <CollapsibleCardWrapper title="Add New Product" headerColor="green" defaultExpanded={true}>
      <AddProductForm />
    </CollapsibleCardWrapper>
  );
};

export default AddNewProductCard;
