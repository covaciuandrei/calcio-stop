import React from 'react';
import { useRouteData } from '../../hooks/useRouteData';
import AddNewReservationCard from './AddNewReservationCard';
import ReservationsTableListCard from './ReservationsTableListCard';

const ReservationsPage: React.FC = () => {
  // Load all data needed for reservations page
  useRouteData();

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
