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
    <div className="form-group" ref={dropdownRef} style={{ position: 'relative' }}>
      <label>Nameset</label>
      <div
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '38px',
        }}
      >
        <span style={{ color: selectedNameset ? '#000' : '#999' }}>
          {selectedNameset
            ? `${selectedNameset.playerName} #${selectedNameset.number} (${selectedNameset.season})`
            : placeholder}
        </span>
        <span style={{ fontSize: '12px' }}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            maxHeight: '300px',
            overflow: 'hidden',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {/* Add New Button */}
          <div
            onClick={handleAddNew}
            style={{
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '500',
            }}
          >
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
            <div style={{ padding: '8px 12px', borderBottom: '1px solid #eee' }}>
              <input
                type="text"
                placeholder="Search namesets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '3px',
                  fontSize: '14px',
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Nameset List */}
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {/* No nameset option */}
            <div
              onClick={() => handleNamesetSelect(null)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: selectedNamesetId === null ? '#e3f2fd' : 'transparent',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <span style={{ fontStyle: 'italic', color: '#666' }}>No nameset</span>
            </div>

            {/* Nameset options */}
            {filteredNamesets.length === 0 && namesets.length > 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>No namesets found</div>
            ) : (
              filteredNamesets.map((nameset) => (
                <div
                  key={nameset.id}
                  onClick={() => handleNamesetSelect(nameset)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: selectedNamesetId === nameset.id ? '#e3f2fd' : 'transparent',
                    borderBottom: '1px solid #f0f0f0',
                  }}
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
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
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
