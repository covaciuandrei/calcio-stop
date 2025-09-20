import React, { useEffect, useRef, useState } from 'react';
import { Nameset } from '../types/types';
import AddNamesetForm from './AddNamesetForm';

interface Props {
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  selectedNamesetId: string | null;
  onNamesetSelect: (namesetId: string | null) => void;
  placeholder?: string;
}

const NamesetPicker: React.FC<Props> = ({
  namesets,
  setNamesets,
  selectedNamesetId,
  onNamesetSelect,
  placeholder = 'Select a nameset...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setShowAddForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scrolling when dropdown is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const selectedNameset = namesets.find((n) => n.id === selectedNamesetId);

  const filteredNamesets = namesets.filter(
    (nameset) =>
      nameset.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nameset.season.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nameset.number.toString().includes(searchTerm)
  );

  const handleNamesetSelect = (nameset: Nameset | null) => {
    onNamesetSelect(nameset?.id || null);
    setIsOpen(false);
    setSearchTerm('');
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    setShowAddForm(true);
  };

  const handleNewNamesetAdded = (newNameset: Nameset) => {
    setShowAddForm(false);
    handleNamesetSelect(newNameset);
  };

  return (
    <div className="form-group nameset-picker" ref={dropdownRef}>
      <label>Nameset</label>
      <div className="nameset-picker-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span style={{ color: selectedNameset ? '#000' : '#999' }}>
          {selectedNameset
            ? `${selectedNameset.playerName} #${selectedNameset.number} (${selectedNameset.season})`
            : placeholder}
        </span>
        <span style={{ fontSize: '12px' }}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="nameset-picker-dropdown">
          {/* Add New Button */}
          <div className="nameset-picker-add-button" onClick={handleAddNew}>
            <span style={{ fontSize: '16px' }}>+</span>
            Add New Nameset
          </div>

          {/* Add Nameset Form */}
          {showAddForm && (
            <div style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
              <AddNamesetForm namesets={namesets} setNamesets={setNamesets} onAdd={handleNewNamesetAdded} />
            </div>
          )}

          {/* Search Box */}
          {namesets.length > 0 && (
            <div className="nameset-picker-search">
              <input
                type="text"
                placeholder="Search namesets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Nameset List */}
          <div className="nameset-picker-list">
            {/* No nameset option */}
            <div
              className={`nameset-picker-option ${selectedNamesetId === null ? 'selected' : ''} no-nameset`}
              onClick={() => handleNamesetSelect(null)}
            >
              No nameset
            </div>

            {/* Nameset options */}
            {filteredNamesets.length === 0 && namesets.length > 0 ? (
              <div className="nameset-picker-empty">No namesets found</div>
            ) : (
              filteredNamesets.map((nameset) => (
                <div
                  key={nameset.id}
                  className={`nameset-picker-option ${selectedNamesetId === nameset.id ? 'selected' : ''}`}
                  onClick={() => handleNamesetSelect(nameset)}
                >
                  <div style={{ fontWeight: '500' }}>
                    {nameset.playerName} #{nameset.number}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{nameset.season}</div>
                </div>
              ))
            )}

            {/* Empty state */}
            {namesets.length === 0 && !showAddForm && (
              <div className="nameset-picker-empty">
                <div>No namesets available</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Click "Add New Nameset" to create one</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NamesetPicker;
