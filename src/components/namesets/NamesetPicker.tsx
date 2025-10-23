import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNamesetsList } from '../../stores';
import styles from '../shared/Picker.module.css';
import AddNamesetForm from './AddNamesetForm';

interface Props {
  selectedNamesetId: string | null;
  onNamesetSelect: (id: string | null) => void;
  placeholder?: string;
}

const NamesetPicker: React.FC<Props> = ({ selectedNamesetId, onNamesetSelect, placeholder = 'Select a nameset' }) => {
  // Get namesets from store
  const namesets = useNamesetsList();
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

  const filteredNamesets = namesets.filter(
    (n) =>
      (n.playerName || '').toLowerCase().includes(search.toLowerCase()) || (n.number || '').toString().includes(search)
  );

  const selectedNameset = namesets.find((n) => n.id === selectedNamesetId);

  return (
    <div className={styles.picker} ref={pickerRef} style={{ width: '200px' }}>
      <div
        className={`${styles.pickerTrigger} ${adding ? styles.disabled : ''}`}
        onClick={() => !adding && setIsOpen((prev) => !prev)}
      >
        {selectedNamesetId === null
          ? 'None'
          : selectedNameset
            ? `${selectedNameset.playerName} #${selectedNameset.number} - ${selectedNameset.season} (Qty: ${selectedNameset.quantity})`
            : placeholder}
        <span style={{ marginLeft: 'auto' }}>▼</span>
      </div>

      {/* Dropdown for selecting existing namesets */}
      {isOpen &&
        !adding &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.pickerDropdown}
            style={{
              width: 320,
              left: pickerRef.current?.getBoundingClientRect().left,
              top: pickerRef.current?.getBoundingClientRect().bottom,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.pickerAddButton} onClick={() => setAdding(true)}>
              + Add Nameset
            </div>
            <div className={styles.pickerSearch}>
              <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className={styles.pickerList}>
              {/* None option */}
              <div
                className={`${styles.pickerOption} ${selectedNamesetId === null ? styles.selected : ''}`}
                onClick={() => {
                  onNamesetSelect(null);
                  setIsOpen(false);
                }}
              >
                None
              </div>
              {filteredNamesets.length === 0 && <div className={styles.pickerEmpty}>No namesets found</div>}
              {filteredNamesets.map((n) => (
                <div
                  key={n.id}
                  className={`${styles.pickerOption} ${n.id === selectedNamesetId ? styles.selected : ''}`}
                  onClick={() => {
                    onNamesetSelect(n.id);
                    setIsOpen(false);
                  }}
                >
                  {n.playerName} #{n.number} - {n.season} (Qty: {n.quantity})
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}

      {/* Add Nameset Form Modal */}
      {adding &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.pickerDropdown}
            style={{
              width: 320,
              left: pickerRef.current?.getBoundingClientRect().left,
              top: pickerRef.current?.getBoundingClientRect().bottom,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.pickerFormContainer}>
              <AddNamesetForm
                onAdd={(newNameset) => {
                  onNamesetSelect(newNameset.id);
                  setAdding(false);
                }}
                isInDropdown={true}
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

export default NamesetPicker;
