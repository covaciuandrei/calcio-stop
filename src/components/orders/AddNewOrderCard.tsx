import React from 'react';
import CollapsibleCardWrapper from '../shared/CollapsibleCardWrapper';
import AddOrderForm from './AddOrderForm';

const AddNewOrderCard: React.FC = () => {
  return (
    <CollapsibleCardWrapper title="Add New Order" headerColor="green" defaultExpanded={true}>
      <AddOrderForm />
    </CollapsibleCardWrapper>
  );
};

export default AddNewOrderCard;
