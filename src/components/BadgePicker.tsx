import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Badge } from '../types/types';
import AddBadgeForm from './AddBadgeForm';

interface Props {
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  selectedBadgeId: string | null;
  onBadgeSelect: (id: string) => void;
  placeholder?: string;
}

const BadgePicker: React.FC<Props> = ({
  badges,
  setBadges,
  selectedBadgeId,
  onBadgeSelect,
  placeholder = 'Select a badge',
}) => {
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
    <div className="nameset-picker" ref={pickerRef} style={{ width: '200px' }}>
      <div
        className={`nameset-picker-trigger ${adding ? 'disabled' : ''}`}
        onClick={() => !adding && setIsOpen((prev) => !prev)}
      >
        {selectedBadge ? selectedBadge.name : placeholder}
        <span style={{ marginLeft: 'auto' }}>▼</span>
      </div>

      {/* Dropdown for selecting existing badges */}
      {isOpen &&
        !adding &&
        createPortal(
          <div
            ref={dropdownRef}
            className="nameset-picker-dropdown"
            style={{
              width: 280,
              left: pickerRef.current?.getBoundingClientRect().left,
              top: pickerRef.current?.getBoundingClientRect().bottom,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="nameset-picker-add-button" onClick={() => setAdding(true)}>
              + Add Badge
            </div>
            <div className="nameset-picker-search">
              <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="nameset-picker-list">
              {filteredBadges.length === 0 && <div className="nameset-picker-empty">No badges found</div>}
              {filteredBadges.map((b) => (
                <div
                  key={b.id}
                  className={`nameset-picker-option ${b.id === selectedBadgeId ? 'selected' : ''}`}
                  onClick={() => {
                    onBadgeSelect(b.id);
                    setIsOpen(false);
                  }}
                >
                  {b.name} - {b.season}
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
            className="nameset-picker-dropdown"
            style={{
              width: 280,
              left: pickerRef.current?.getBoundingClientRect().left,
              top: pickerRef.current?.getBoundingClientRect().bottom,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '10px',
                boxSizing: 'border-box',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <AddBadgeForm
                badges={badges}
                setBadges={setBadges}
                onAdd={(newBadge) => {
                  onBadgeSelect(newBadge.id);
                  setAdding(false);
                }}
              />
              <button
                style={{
                  marginTop: '10px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  height: '32px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
                onClick={() => setAdding(false)}
              >
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
