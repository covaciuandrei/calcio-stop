import React, { useState } from 'react';
import { Team } from '../../types';
import ArchivedTeams from './ArchivedTeams';

interface Props {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  archivedTeams: Team[];
  setArchivedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const ArchivedTeamsCard: React.FC<Props> = ({ teams, setTeams, archivedTeams, setArchivedTeams }) => {
  const [isArchivedTeamsExpanded, setIsArchivedTeamsExpanded] = useState(false);
  const [archivedTeamsSearchTerm, setArchivedTeamsSearchTerm] = useState('');

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      {archivedTeams.length > 0 ? (
        <>
          <div
            className="card-header mini-header mini-header-red"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onClick={() => setIsArchivedTeamsExpanded(!isArchivedTeamsExpanded)}
          >
            <span>Archived Teams ({archivedTeams.length})</span>
            <span style={{ fontSize: '12px' }}>{isArchivedTeamsExpanded ? '▼' : '▶'}</span>
          </div>
          {!isArchivedTeamsExpanded && (
            <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
              There are {archivedTeams.length} teams available.
            </div>
          )}
          {isArchivedTeamsExpanded && (
            <>
              <h3 className="card-section-header">Archived Teams List</h3>
              {archivedTeams.length >= 2 && (
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="text"
                    placeholder="Search archived teams..."
                    value={archivedTeamsSearchTerm}
                    onChange={(e) => setArchivedTeamsSearchTerm(e.target.value)}
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
                <ArchivedTeams
                  archivedTeams={archivedTeams}
                  setArchivedTeams={setArchivedTeams}
                  setTeams={setTeams}
                  searchTerm={archivedTeamsSearchTerm}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="card-header mini-header mini-header-red">
            <span>Archived Teams (0)</span>
          </div>
          <div style={{ padding: '10px 20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
            No archived teams available.
          </div>
        </>
      )}
    </div>
  );
};

export default ArchivedTeamsCard;
