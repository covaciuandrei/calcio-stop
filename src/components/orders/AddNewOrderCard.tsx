import React, { useState } from 'react';
import CollapsibleCardWrapper from '../shared/CollapsibleCardWrapper';
import AddOrderForm from './AddOrderForm';

const AddNewOrderCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [formKey, setFormKey] = useState(0);

  const handleClose = () => {
    setIsExpanded(false);
    // Increment key to force form remount and reset all fields
    setFormKey((prev) => prev + 1);
    // Re-expand after a short delay
    setTimeout(() => setIsExpanded(true), 100);
  };

  return (
    <CollapsibleCardWrapper title="Add New Order" headerColor="green" defaultExpanded={isExpanded}>
      <AddOrderForm key={formKey} onClose={handleClose} />
    </CollapsibleCardWrapper>
  );
};

export default AddNewOrderCard;

