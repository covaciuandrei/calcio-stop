import React from 'react';
import AddReservationForm from './AddReservationForm';

const AddNewReservationCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Create New Reservation</span>
      </div>
      <div className="card-content">
        <AddReservationForm />
      </div>
    </div>
  );
};

export default AddNewReservationCard;
