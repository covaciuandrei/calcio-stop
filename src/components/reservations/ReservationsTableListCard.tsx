import React, { useEffect, useMemo, useState } from 'react';
import { useReservationsActions, useReservationsList } from '../../stores';
import { Reservation } from '../../types';
import styles from '../shared/TableListCard.module.css';
import EditReservationModal from './EditReservationModal';
import ReservationsTableList from './ReservationsTableList';

const ReservationsTableListCard: React.FC = () => {
  // Get data and actions from stores
  const reservations = useReservationsList();
  const { deleteReservation, completeReservation, loadReservations } = useReservationsActions();
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isReservationsExpanded, setIsReservationsExpanded] = useState(true);
  const [reservationsSearchTerm, setReservationsSearchTerm] = useState('');

  // Load reservations on mount
  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  // Sort reservations by created date descending (most recent first)
  const sortedReservations = useMemo(() => {
    return [...reservations].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }, [reservations]);

  const handleDelete = (id: string, status: 'pending' | 'completed') => {
    const message =
      status === 'completed'
        ? 'Are you sure you want to delete this reservation?'
        : 'Are you sure you want to delete this reservation? Stock will be restored.';
    if (!window.confirm(message)) return;
    deleteReservation(id);
    setReservationsSearchTerm(''); // Clear search after action
  };

  const handleComplete = (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to complete this reservation? This will create a sale and mark the reservation as completed.'
      )
    )
      return;
    completeReservation(id, {});
    setReservationsSearchTerm(''); // Clear search after action
  };

  const handleEditClick = (reservation: Reservation) => {
    setEditingReservation(reservation);
  };

  return (
    <>
      <div className="card">
        <div
          className={`card-header mini-header mini-header-orange ${styles.expandableHeader}`}
          onClick={() => setIsReservationsExpanded(!isReservationsExpanded)}
        >
          <span>Reservations ({sortedReservations.length})</span>
          <span className={`${styles.expandIcon} ${isReservationsExpanded ? styles.expanded : styles.collapsed}`}>
            ▼
          </span>
        </div>
        {!isReservationsExpanded && (
          <div className={styles.collapsedContent}>
            {sortedReservations.length > 0
              ? `There are ${sortedReservations.length} reservations.`
              : 'No reservations found.'}
          </div>
        )}
        {isReservationsExpanded && (
          <>
            <h3 className="card-section-header">Reservations History</h3>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              {sortedReservations.length >= 2 && (
                <div className={styles.searchContainer} style={{ flex: 1, minWidth: '200px' }}>
                  <input
                    type="text"
                    placeholder="Search reservations..."
                    value={reservationsSearchTerm}
                    onChange={(e) => setReservationsSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              )}
            </div>
            {sortedReservations.length > 0 ? (
              <div className={styles.tableContainer}>
                <ReservationsTableList
                  reservations={sortedReservations}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  onComplete={handleComplete}
                  searchTerm={reservationsSearchTerm}
                />
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No reservations found.</p>
              </div>
            )}
          </>
        )}
      </div>

      <EditReservationModal editingReservation={editingReservation} setEditingReservation={setEditingReservation} />
    </>
  );
};

export default ReservationsTableListCard;
