import React from 'react';
import CollapsibleCardWrapper from '../shared/CollapsibleCardWrapper';
import AddProductLinkForm from './AddProductLinkForm';

const AddNewProductLinkCard: React.FC = () => {
  return (
    <CollapsibleCardWrapper title="Add New Product Link" headerColor="green" defaultExpanded={true}>
      <AddProductLinkForm />
    </CollapsibleCardWrapper>
  );
};

export default AddNewProductLinkCard;
