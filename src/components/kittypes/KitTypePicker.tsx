import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useKitTypesList } from '../../stores';
import styles from '../shared/Picker.module.css';
import AddKitTypeForm from './AddKitTypeForm';

interface Props {
  selectedKitTypeId: string;
  onKitTypeSelect: (id: string) => void;
}

const KitTypePicker: React.FC<Props> = ({ selectedKitTypeId, onKitTypeSelect }) => {
  // Get kit types from store and sort by creation date
  const allKitTypes = useKitTypesList();
  const kitTypes = useMemo(
    () => [...allKitTypes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [allKitTypes]
  );
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

  const filteredKitTypes = kitTypes.filter((kt) => kt.name.toLowerCase().includes(search.toLowerCase()));

  const selectedKitType = kitTypes.find((kt) => kt.id === selectedKitTypeId);

  // If selected kit type is not found, default to the first available kit type
  const displayName = selectedKitType
    ? selectedKitType.name
    : kitTypes.length > 0
      ? kitTypes[0].name
      : 'Select Kit Type';

  return (
    <div className={styles.picker} ref={pickerRef} style={{ width: '200px' }}>
      <div
        className={`${styles.pickerTrigger} ${adding ? styles.disabled : ''}`}
        onClick={() => !adding && setIsOpen((prev) => !prev)}
      >
        {displayName}
        <span style={{ marginLeft: 'auto' }}>▼</span>
      </div>

      {/* Dropdown for selecting existing kit types */}
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
              + Add Kit Type
            </div>
            <div className={styles.pickerSearch}>
              <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className={styles.pickerList}>
              {filteredKitTypes.length === 0 && <div className={styles.pickerEmpty}>No kit types found</div>}
              {filteredKitTypes.map((kt) => (
                <div
                  key={kt.id}
                  className={`${styles.pickerOption} ${kt.id === selectedKitTypeId ? styles.selected : ''}`}
                  onClick={() => {
                    onKitTypeSelect(kt.id);
                    setIsOpen(false);
                  }}
                >
                  {kt.name}
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}

      {/* Add Kit Type Form Modal */}
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
              <AddKitTypeForm
                onAdd={(newKitType) => {
                  onKitTypeSelect(newKitType.id);
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

export default KitTypePicker;
