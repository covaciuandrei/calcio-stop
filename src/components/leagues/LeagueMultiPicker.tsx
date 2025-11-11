import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLeaguesList } from '../../stores';
import styles from '../shared/Picker.module.css';
import AddLeagueForm from './AddLeagueForm';

interface Props {
  selectedLeagueIds: string[];
  onLeaguesChange: (leagueIds: string[]) => void;
  placeholder?: string;
}

const LeagueMultiPicker: React.FC<Props> = ({
  selectedLeagueIds,
  onLeaguesChange,
  placeholder = 'Select leagues',
}) => {
  // Get leagues from store
  const leagues = useLeaguesList();
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

  const filteredLeagues = leagues.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()));

  const selectedLeagues = leagues.filter((l) => selectedLeagueIds.includes(l.id));
  const displayText =
    selectedLeagues.length === 0
      ? placeholder
      : selectedLeagues.length === 1
        ? selectedLeagues[0].name
        : `${selectedLeagues.length} leagues selected`;

  const handleToggleLeague = (leagueId: string) => {
    if (selectedLeagueIds.includes(leagueId)) {
      // Remove league
      onLeaguesChange(selectedLeagueIds.filter((id) => id !== leagueId));
    } else {
      // Add league
      onLeaguesChange([...selectedLeagueIds, leagueId]);
    }
  };

  return (
    <div className={styles.picker} ref={pickerRef} style={{ width: '100%' }}>
      <div
        className={`${styles.pickerTrigger} ${adding ? styles.disabled : ''}`}
        onClick={() => !adding && setIsOpen((prev) => !prev)}
      >
        {displayText}
        <span style={{ marginLeft: 'auto' }}>▼</span>
      </div>

      {/* Dropdown for selecting existing leagues */}
      {isOpen &&
        !adding &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.pickerDropdown}
            style={{
              width: 300,
              maxHeight: '400px',
              overflowY: 'auto',
              left: pickerRef.current?.getBoundingClientRect().left,
              top: pickerRef.current?.getBoundingClientRect().bottom,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.pickerAddButton} onClick={() => setAdding(true)}>
              + Add League
            </div>
            <div className={styles.pickerSearch}>
              <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className={styles.pickerList}>
              {filteredLeagues.length === 0 && <div className={styles.pickerEmpty}>No leagues found</div>}
              {filteredLeagues.map((l) => {
                const isSelected = selectedLeagueIds.includes(l.id);
                return (
                  <div
                    key={l.id}
                    className={`${styles.pickerOption} ${isSelected ? styles.selected : ''}`}
                    onClick={() => handleToggleLeague(l.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleLeague(l.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '14px',
                        height: '14px',
                        margin: 0,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1 }}>{l.name}</span>
                  </div>
                );
              })}
            </div>
          </div>,
          document.body
        )}

      {/* Add League Form Modal */}
      {adding &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.pickerDropdown}
            style={{
              width: 300,
              left: pickerRef.current?.getBoundingClientRect().left,
              top: pickerRef.current?.getBoundingClientRect().bottom,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.pickerFormContainer}>
              <AddLeagueForm
                onAdd={(newLeague) => {
                  onLeaguesChange([...selectedLeagueIds, newLeague.id]);
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

export default LeagueMultiPicker;

