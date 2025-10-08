import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBadgesList } from '../../stores';
import styles from '../shared/Picker.module.css';
import AddBadgeForm from './AddBadgeForm';

interface Props {
  selectedBadgeId: string | null;
  onBadgeSelect: (id: string | null) => void;
  placeholder?: string;
}

const BadgePicker: React.FC<Props> = ({ selectedBadgeId, onBadgeSelect, placeholder = 'Select a badge' }) => {
  // Get badges from store
  const badges = useBadgesList();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown or modal when clicking outside and update position on scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setAdding(false);
      }
    };

    const updatePosition = () => {
      if (isOpen && dropdownRef.current && pickerRef.current) {
        const rect = pickerRef.current.getBoundingClientRect();
        dropdownRef.current.style.left = `${rect.left}px`;
        dropdownRef.current.style.top = `${rect.bottom}px`;
      }
    };

    const handleScroll = () => {
      updatePosition();
    };

    const handleResize = () => {
      updatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const filteredBadges = badges.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));

  const selectedBadge = badges.find((b) => b.id === selectedBadgeId);

  return (
    <div className={styles.picker} ref={pickerRef} style={{ width: '200px' }}>
      <div
        className={`${styles.pickerTrigger} ${adding ? styles.disabled : ''}`}
        onClick={() => !adding && setIsOpen((prev) => !prev)}
      >
        {selectedBadgeId === null
          ? 'None'
          : selectedBadge
            ? `${selectedBadge.name} - ${selectedBadge.season} (Qty: ${selectedBadge.quantity})`
            : placeholder}
        <span style={{ marginLeft: 'auto' }}>▼</span>
      </div>

      {/* Dropdown for selecting existing badges */}
      {isOpen &&
        !adding &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.pickerDropdown}
            style={{
              width: 280,
              left: pickerRef.current?.getBoundingClientRect().left,
              top: pickerRef.current?.getBoundingClientRect().bottom,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.pickerAddButton} onClick={() => setAdding(true)}>
              + Add Badge
            </div>
            <div className={styles.pickerSearch}>
              <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className={styles.pickerList}>
              {/* None option */}
              <div
                className={`${styles.pickerOption} ${selectedBadgeId === null ? styles.selected : ''}`}
                onClick={() => {
                  onBadgeSelect(null);
                  setIsOpen(false);
                }}
              >
                None
              </div>
              {filteredBadges.length === 0 && <div className={styles.pickerEmpty}>No badges found</div>}
              {filteredBadges.map((b) => (
                <div
                  key={b.id}
                  className={`${styles.pickerOption} ${b.id === selectedBadgeId ? styles.selected : ''}`}
                  onClick={() => {
                    onBadgeSelect(b.id);
                    setIsOpen(false);
                  }}
                >
                  {b.name} - {b.season} (Qty: {b.quantity})
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}

      {/* Add Badge Form Modal */}
      {adding &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.pickerDropdown}
            style={{
              width: 280,
              left: pickerRef.current?.getBoundingClientRect().left,
              top: pickerRef.current?.getBoundingClientRect().bottom,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.pickerFormContainer}>
              <AddBadgeForm
                onAdd={(newBadge) => {
                  onBadgeSelect(newBadge.id);
                  setAdding(false);
                }}
              />
              <button className={styles.pickerCancelButton} onClick={() => setAdding(false)}>
                Cancel
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default BadgePicker;
