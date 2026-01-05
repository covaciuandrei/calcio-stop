import React from 'react';
import CollapsibleCardWrapper from '../shared/CollapsibleCardWrapper';
import AddSaleForm from './AddSaleForm';

const AddNewSaleCard: React.FC = () => {
  return (
    <CollapsibleCardWrapper title="Record New Sale" headerColor="green" defaultExpanded={true}>
      <AddSaleForm />
    </CollapsibleCardWrapper>
  );
};

export default AddNewSaleCard;
