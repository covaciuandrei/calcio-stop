import React from 'react';
import CollapsibleCardWrapper from '../shared/CollapsibleCardWrapper';
import AddKitTypeForm from './AddKitTypeForm';

const AddNewKitTypeCard: React.FC = () => {
  return (
    <CollapsibleCardWrapper title="Add New Kit Type" headerColor="green" defaultExpanded={true}>
      <AddKitTypeForm />
    </CollapsibleCardWrapper>
  );
};

export default AddNewKitTypeCard;
