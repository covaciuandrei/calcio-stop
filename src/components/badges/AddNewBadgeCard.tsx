import React from 'react';
import CollapsibleCardWrapper from '../shared/CollapsibleCardWrapper';
import AddBadgeForm from './AddBadgeForm';

const AddNewBadgeCard: React.FC = () => {
  return (
    <CollapsibleCardWrapper title="Add New Badge" headerColor="green" defaultExpanded={true}>
      <AddBadgeForm />
    </CollapsibleCardWrapper>
  );
};

export default AddNewBadgeCard;
