import React, { useState } from 'react';
import { Nameset } from '../types/types';
import ArchivedNamesets from './ArchivedNamesets';
import NamesetSection from './NamesetSection';

interface Props {
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  archivedNamesets: Nameset[];
  setArchivedNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
}

const NamesetsPage: React.FC<Props> = ({ namesets, setNamesets, archivedNamesets, setArchivedNamesets }) => {
  const [isArchivedNamesetsExpanded, setIsArchivedNamesetsExpanded] = useState(false);
  const [archivedNamesetsSearchTerm, setArchivedNamesetsSearchTerm] = useState('');

  return (
    <div>
      {/* Active Namesets Section */}
      <NamesetSection
        namesets={namesets}
        setNamesets={setNamesets}
        archivedNamesets={archivedNamesets}
        setArchivedNamesets={setArchivedNamesets}
      />

      {/* Archived Namesets Card */}
      <div className="card" style={{ marginTop: '20px' }}>
        {archivedNamesets.length > 0 ? (
          <>
            <div
              className="card-header mini-header mini-header-red"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onClick={() => setIsArchivedNamesetsExpanded(!isArchivedNamesetsExpanded)}
            >
              <span>Archived Namesets ({archivedNamesets.length})</span>
              <span style={{ fontSize: '12px' }}>{isArchivedNamesetsExpanded ? '▼' : '▶'}</span>
            </div>
            {!isArchivedNamesetsExpanded && (
              <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                There are {archivedNamesets.length} namesets available.
              </div>
            )}
            {isArchivedNamesetsExpanded && (
              <>
                <h3 className="card-section-header">Archived Namesets List</h3>
                {archivedNamesets.length >= 2 && (
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Search archived namesets..."
                      value={archivedNamesetsSearchTerm}
                      onChange={(e) => setArchivedNamesetsSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                )}
                <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
                  <ArchivedNamesets
                    archivedNamesets={archivedNamesets}
                    setArchivedNamesets={setArchivedNamesets}
                    setNamesets={setNamesets}
                    searchTerm={archivedNamesetsSearchTerm}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-header mini-header mini-header-red">
              <span>Archived Namesets (0)</span>
            </div>
            <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
              No archived namesets available.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NamesetsPage;
