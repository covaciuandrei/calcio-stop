import React from 'react';
import CollapsibleCardWrapper from '../shared/CollapsibleCardWrapper';
import AddLeagueForm from './AddLeagueForm';

const AddNewLeagueCard: React.FC = () => {
  return (
    <CollapsibleCardWrapper title="Add New League" headerColor="green" defaultExpanded={true}>
      <AddLeagueForm />
    </CollapsibleCardWrapper>
  );
};

export default AddNewLeagueCard;
