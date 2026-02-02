import React, { useState } from 'react';
import CollapsibleCardWrapper from '../shared/CollapsibleCardWrapper';
import AddOrderForm from './AddOrderForm';

const AddNewOrderCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClose = () => {
    setIsExpanded(false);
    // Re-expand after a short delay to reset the form
    setTimeout(() => setIsExpanded(true), 100);
  };

  return (
    <CollapsibleCardWrapper title="Add New Order" headerColor="green" defaultExpanded={isExpanded}>
      <AddOrderForm onClose={handleClose} />
    </CollapsibleCardWrapper>
  );
};

export default AddNewOrderCard;
