import React from 'react';
import CollapsibleCardWrapper from '../shared/CollapsibleCardWrapper';
import AddNamesetForm from './AddNamesetForm';

const AddNewNamesetCard: React.FC = () => {
  return (
    <CollapsibleCardWrapper title="Add New Nameset" headerColor="green" defaultExpanded={true}>
      <AddNamesetForm />
    </CollapsibleCardWrapper>
  );
};

export default AddNewNamesetCard;
