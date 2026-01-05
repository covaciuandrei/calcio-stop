import React from 'react';
import CollapsibleCardWrapper from '../shared/CollapsibleCardWrapper';
import AddReservationForm from './AddReservationForm';

const AddNewReservationCard: React.FC = () => {
  return (
    <CollapsibleCardWrapper title="Create New Reservation" headerColor="green" defaultExpanded={true}>
      <AddReservationForm />
    </CollapsibleCardWrapper>
  );
};

export default AddNewReservationCard;
