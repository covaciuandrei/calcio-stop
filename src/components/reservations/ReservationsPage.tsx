import React from 'react';
import AddNewReservationCard from './AddNewReservationCard';
import ReservationsTableListCard from './ReservationsTableListCard';

const ReservationsPage: React.FC = () => {
  return (
    <div>
      {/* Add New Reservation Card */}
      <AddNewReservationCard />

      {/* Reservations Table List Card */}
      <ReservationsTableListCard />
    </div>
  );
};

export default ReservationsPage;
