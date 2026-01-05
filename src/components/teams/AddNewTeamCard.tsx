import React from 'react';
import CollapsibleCardWrapper from '../shared/CollapsibleCardWrapper';
import AddTeamForm from './AddTeamForm';

const AddNewTeamCard: React.FC = () => {
  return (
    <CollapsibleCardWrapper title="Add New Team" headerColor="green" defaultExpanded={true}>
      <AddTeamForm />
    </CollapsibleCardWrapper>
  );
};

export default AddNewTeamCard;
