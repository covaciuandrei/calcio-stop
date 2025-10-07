import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTeamsList } from '../../stores';
import styles from '../shared/Picker.module.css';
import AddTeamForm from './AddTeamForm';

interface Props {
  selectedTeamId: string | null;
  onTeamSelect: (id: string) => void;
  placeholder?: string;
}

const TeamPicker: React.FC<Props> = ({ selectedTeamId, onTeamSelect, placeholder = 'Select a team' }) => {
  // Get teams from store
  const teams = useTeamsList();
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

  const filteredTeams = teams.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  return (
    <div className={styles.picker} ref={pickerRef} style={{ width: '200px' }}>
      <div
        className={`${styles.pickerTrigger} ${adding ? styles.disabled : ''}`}
        onClick={() => !adding && setIsOpen((prev) => !prev)}
      >
        {selectedTeam ? selectedTeam.name : placeholder}
        <span style={{ marginLeft: 'auto' }}>▼</span>
      </div>

      {/* Dropdown for selecting existing teams */}
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
              + Add Team
            </div>
            <div className={styles.pickerSearch}>
              <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className={styles.pickerList}>
              {filteredTeams.length === 0 && <div className={styles.pickerEmpty}>No teams found</div>}
              {filteredTeams.map((t) => (
                <div
                  key={t.id}
                  className={`${styles.pickerOption} ${t.id === selectedTeamId ? styles.selected : ''}`}
                  onClick={() => {
                    onTeamSelect(t.id);
                    setIsOpen(false);
                  }}
                >
                  {t.name}
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}

      {/* Add Team Form Modal */}
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
              <AddTeamForm
                onAdd={(newTeam) => {
                  onTeamSelect(newTeam.id);
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

export default TeamPicker;
