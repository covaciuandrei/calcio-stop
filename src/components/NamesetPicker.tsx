import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Nameset } from '../types/types';
import AddNamesetForm from './AddNamesetForm';

interface Props {
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  selectedNamesetId: string | null;
  onNamesetSelect: (id: string) => void;
  placeholder?: string;
}

const NamesetPicker: React.FC<Props> = ({
  namesets,
  setNamesets,
  selectedNamesetId,
  onNamesetSelect,
  placeholder = 'Select a nameset',
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

  const filteredNamesets = namesets.filter(
    (n) => n.playerName.toLowerCase().includes(search.toLowerCase()) || n.number.toString().includes(search)
  );

  const selectedNameset = namesets.find((n) => n.id === selectedNamesetId);

  return (
    <div className="nameset-picker" ref={pickerRef} style={{ width: '200px' }}>
      <div
        className={`nameset-picker-trigger ${adding ? 'disabled' : ''}`}
        onClick={() => !adding && setIsOpen((prev) => !prev)}
      >
        {selectedNameset ? `${selectedNameset.playerName} (${selectedNameset.number})` : placeholder}
        <span style={{ marginLeft: 'auto' }}>▼</span>
      </div>

      {/* Dropdown for selecting existing namesets */}
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
              + Add Nameset
            </div>
            <div className="nameset-picker-search">
              <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="nameset-picker-list">
              {filteredNamesets.length === 0 && <div className="nameset-picker-empty">No namesets found</div>}
              {filteredNamesets.map((n) => (
                <div
                  key={n.id}
                  className={`nameset-picker-option ${n.id === selectedNamesetId ? 'selected' : ''}`}
                  onClick={() => {
                    onNamesetSelect(n.id);
                    setIsOpen(false);
                  }}
                >
                  {n.playerName} ({n.number})
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}

      {/* Modal for adding a new nameset */}
      {adding &&
        createPortal(
          <div className="modal" onMouseDown={() => setAdding(false)}>
            <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
              <h3>Add Nameset</h3>
              <AddNamesetForm
                namesets={namesets}
                setNamesets={setNamesets}
                onAdd={(newNameset) => {
                  onNamesetSelect(newNameset.id);
                  setAdding(false);
                }}
              />
              <div className="modal-buttons">
                <button onClick={() => setAdding(false)}>Cancel</button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default NamesetPicker;
